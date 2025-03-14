document.addEventListener("DOMContentLoaded", function () {
    const directoryNameInput = document.getElementById("directoryName");
    const urlInput = document.getElementById("url");

    // Retrieve stored values when the extension popup opens
    chrome.storage.local.get(["directoryName", "url"], function (data) {
        if (data.directoryName) directoryNameInput.value = data.directoryName;
        if (data.url) urlInput.value = data.url;
    });

    // Save values whenever input changes
    function saveFormData() {
        chrome.storage.local.set({
            directoryName: directoryNameInput.value,
            url: urlInput.value
        });
    }

    directoryNameInput.addEventListener("input", saveFormData);
    urlInput.addEventListener("input", saveFormData);
});

