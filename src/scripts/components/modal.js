// src/scripts/components/modal.js

let currentOpenedModal = null;

export const handleEscUp = (evt) => {
  if (evt.key === "Escape") {
    const activePopup = document.querySelector(".popup_is-opened");
    if (activePopup) {
      closeModalWindow(activePopup);
    }
  }
};

export const openModalWindow = (modalWindow) => {
  modalWindow.classList.add("popup_is-opened");
  currentOpenedModal = modalWindow;
  document.addEventListener("keydown", handleEscUp);
};

export const closeModalWindow = (modalWindow) => {
  modalWindow.classList.remove("popup_is-opened");
  currentOpenedModal = null;
  document.removeEventListener("keydown", handleEscUp);
};

export const setCloseModalWindowEventListeners = (modalWindow) => {
  const closeButtonElement = modalWindow.querySelector(".popup__close");
  if (closeButtonElement) {
    closeButtonElement.addEventListener("click", () => {
      closeModalWindow(modalWindow);
    });
  }

  modalWindow.addEventListener("mousedown", (evt) => {
    if (evt.target.classList.contains("popup")) {
      closeModalWindow(modalWindow);
    }
  });
};