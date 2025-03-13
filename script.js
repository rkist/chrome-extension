console.log("script log!")

document.addEventListener("DOMContentLoaded", function () {
    const importButton = document.getElementById("importButton");
    if (importButton) {
        importButton.addEventListener("click", logFormValues);
    }
});

function logFormValues() {
    console.log("log values")
    const directoryName = document.getElementById('directoryName').value;
    const url = document.getElementById('url').value;
    console.log('Directory Name:', directoryName);
    console.log('URL:', url);
}