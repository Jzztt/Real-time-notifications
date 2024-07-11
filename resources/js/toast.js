function showToast(message) {
    const toastElement = document.getElementById("toastMessage");
    toastElement.textContent = message;
    toastElement.style.display = "block";

    setTimeout(() => {
        toastElement.style.display = "none";
    }, 3000);
}

export default showToast;