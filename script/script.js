console.log("script log!")

document.addEventListener("DOMContentLoaded", function () {
    const importButton = document.getElementById("importButton");
    if (importButton) {
        importButton.addEventListener("click", importButtonClicked);
    }
});

function importButtonClicked() {
    console.log("Import started");

    const feedbackMsg = document.getElementById('feedbackMessage');
    feedbackMsg.textContent = "Importing bookmarks...";
    const directoryName = document.getElementById('directoryName').value;
    const url = document.getElementById('url').value;

    console.log('Directory Name:', directoryName);
    console.log('URL:', url);

    // Send request to background script
    chrome.runtime.sendMessage(
        { action: "fetchData", url },
        (response) => {
            if (response.success) {
                const data = response.data;
                console.log("Fetched data:", data);

                try {
                    // Create a bookmarks folder 
                    // Get the Bookmarks Bar folder ID (which is "1")
                    chrome.bookmarks.create({ 
                        parentId: "1",  // "1" is the ID for Bookmarks Bar
                        title: directoryName 
                    }, (folder) => {
                        console.log("Folder created in Bookmarks Bar:", folder);

                        // Process the data structure recursively
                        function processBookmarkStructure(parentId, data, path = []) {
                            for (const key in data) {
                                if (typeof data[key] === 'string') {
                                    // This is a URL, create a bookmark
                                    chrome.bookmarks.create({
                                        parentId: parentId,
                                        title: key,
                                        url: data[key]
                                    }, (bookmark) => {
                                        console.log(`Created bookmark: ${key} at ${path.join('/')}`);
                                    });
                                } else {
                                    // This is a folder, create it and process its contents
                                    chrome.bookmarks.create({
                                        parentId: parentId,
                                        title: key
                                    }, (newFolder) => {
                                        console.log(`Created folder: ${key} at ${path.join('/')}`);
                                        processBookmarkStructure(newFolder.id, data[key], [...path, key]);
                                    });
                                }
                            }
                        }

                        // Start processing from the root data
                        try {
                            processBookmarkStructure(folder.id, data);
                        } catch (error) {
                            console.error("Error processing bookmarks:", error);
                            feedbackMsg.textContent = "Error loading bookmarks";
                        }
                    });
                    feedbackMsg.textContent = "Imported bookmarks successfully";
                } catch (error) {
                    console.error("Error creating bookmarks:", error);
                    feedbackMsg.textContent = "Error creating bookmarks";
                }
            } else {
                feedbackMsg.textContent = "Error fetching data";
                console.error("Error fetching data:", response.error);
            }
        }
    );
}