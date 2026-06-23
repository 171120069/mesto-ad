/*
  Файл index.js является точкой входа в наше приложение
  и только он должен содержать логику инициализации нашего приложения
  используя при этом импорты из других файлов

  Из index.js не допускается что то экспортировать
*/

import { createCard, deleteCard, likeCard, updateLikeState } from "./components/card.js";
import { openModalWindow, closeModalWindow, setCloseModalWindowEventListeners } from "./components/modal.js";
import { enableValidation, clearValidation } from "./components/validation.js";
import { 
  getUserInfo, 
  getCardList, 
  setUserInfo, 
  setUserAvatar, 
  addCard, 
  deleteCardApi, 
  changeLikeStatus 
} from "./components/api.js";

// Настройки валидации
const validationSettings = {
  formSelector: '.popup__form',
  inputSelector: '.popup__input',
  submitButtonSelector: '.popup__button',
  inactiveButtonClass: 'popup__button_disabled',
  inputErrorClass: 'popup__input_type_error',
  errorClass: 'popup__error_visible'
};

// DOM узлы
const placesWrap = document.querySelector(".places__list");
const profileFormModalWindow = document.querySelector(".popup_type_edit");
const profileForm = profileFormModalWindow.querySelector(".popup__form");
const profileTitleInput = profileForm.querySelector(".popup__input_type_name");
const profileDescriptionInput = profileForm.querySelector(".popup__input_type_description");

const cardFormModalWindow = document.querySelector(".popup_type_new-card");
const cardForm = cardFormModalWindow.querySelector(".popup__form");
const cardNameInput = cardForm.querySelector(".popup__input_type_card-name");
const cardLinkInput = cardForm.querySelector(".popup__input_type_url");

const imageModalWindow = document.querySelector(".popup_type_image");
const imageElement = imageModalWindow.querySelector(".popup__image");
const imageCaption = imageModalWindow.querySelector(".popup__caption");

const openProfileFormButton = document.querySelector(".profile__edit-button");
const openCardFormButton = document.querySelector(".profile__add-button");

const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");

const avatarFormModalWindow = document.querySelector(".popup_type_edit-avatar");
const avatarForm = avatarFormModalWindow.querySelector(".popup__form");
const avatarInput = avatarForm.querySelector(".popup__input");

let currentUserId = null;

const handlePreviewPicture = ({ name, link }) => {
  imageElement.src = link;
  imageElement.alt = name;
  imageCaption.textContent = name;
  openModalWindow(imageModalWindow);
};

const handleProfileFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = profileForm.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  
  setUserInfo({
    name: profileTitleInput.value,
    about: profileDescriptionInput.value,
  })
    .then((userData) => {
      profileTitle.textContent = userData.name;
      profileDescription.textContent = userData.about;
      closeModalWindow(profileFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = 'Сохранить';
    });
};

const handleAvatarSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = avatarForm.querySelector('.popup__button');
  submitButton.textContent = 'Сохранение...';
  
  setUserAvatar(avatarInput.value)
    .then((userData) => {
      profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
      closeModalWindow(avatarFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = 'Сохранить';
    });
};

const handleCardFormSubmit = (evt) => {
  evt.preventDefault();
  const submitButton = cardForm.querySelector('.popup__button');
  submitButton.textContent = 'Создание...';
  
  addCard({
    name: cardNameInput.value,
    link: cardLinkInput.value,
  })
    .then((cardData) => {
      const cardElement = createCard(cardData, handlePreviewPicture, currentUserId, handleDeleteCard, handleLikeCard, handleInfoClick);
      placesWrap.prepend(cardElement);
      cardForm.reset();
      closeModalWindow(cardFormModalWindow);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      submitButton.textContent = 'Создать';
    });
};

const handleDeleteCard = (cardId, cardElement) => {
  deleteCardApi(cardId)
    .then(() => {
      cardElement.remove();
    })
    .catch((err) => {
      console.log(err);
    });
};

const handleLikeCard = (cardId, likeButton, likeCount, isLiked) => {
  changeLikeStatus(cardId, isLiked)
    .then((cardData) => {
      updateLikeState(likeButton, likeCount, !isLiked, cardData.likes.length);
    })
    .catch((err) => {
      console.log(err);
    });
};

// Функция форматирования даты
const formatDate = (date) => {
  return date.toLocaleDateString("ru-RU", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

// Обработчик кнопки "i" - информация о карточке
const handleInfoClick = (cardId) => {
  const cardInfoModalWindow = document.querySelector(".popup_type_info");
  const cardInfoTitle = cardInfoModalWindow.querySelector(".popup__title");
  const cardInfoList = cardInfoModalWindow.querySelector(".popup__list");
  const cardInfoText = cardInfoModalWindow.querySelector(".popup__text");
  const cardInfoInfo = cardInfoModalWindow.querySelector(".popup__info");
  const definitionTemplate = document.querySelector("#popup-info-definition-template");
  const userPreviewTemplate = document.querySelector("#popup-info-user-preview-template");

  // Очищаем контейнеры
  cardInfoList.innerHTML = '';
  cardInfoInfo.innerHTML = '';

  // Получаем актуальные данные с сервера
  getCardList()
    .then((cards) => {
      const cardData = cards.find(card => card._id === cardId);
      if (!cardData) {
        console.log('Карточка не найдена');
        return;
      }

      // Заголовок — статичный
      cardInfoTitle.textContent = 'Информация о карточке';

      // Добавляем описание (название карточки)
      const nameElement = definitionTemplate.content.cloneNode(true);
      nameElement.querySelector('.popup__info-term').textContent = 'Описание:';
      nameElement.querySelector('.popup__info-description').textContent = cardData.name;
      cardInfoInfo.append(nameElement);

      // Добавляем дату создания
      const dateElement = definitionTemplate.content.cloneNode(true);
      dateElement.querySelector('.popup__info-term').textContent = 'Дата создания:';
      dateElement.querySelector('.popup__info-description').textContent = formatDate(new Date(cardData.createdAt));
      cardInfoInfo.append(dateElement);

      // Добавляем владельца
      const authorElement = definitionTemplate.content.cloneNode(true);
      authorElement.querySelector('.popup__info-term').textContent = 'Владелец:';
      authorElement.querySelector('.popup__info-description').textContent = cardData.owner.name;
      cardInfoInfo.append(authorElement);

      // Добавляем количество лайков
      const likesElement = definitionTemplate.content.cloneNode(true);
      likesElement.querySelector('.popup__info-term').textContent = 'Количество лайков:';
      likesElement.querySelector('.popup__info-description').textContent = cardData.likes.length;
      cardInfoInfo.append(likesElement);

      // Добавляем список пользователей, лайкнувших карточку
      if (cardData.likes.length > 0) {
        cardInfoText.textContent = 'Лайкнули:';
        cardData.likes.forEach((user) => {
          const userElement = userPreviewTemplate.content.cloneNode(true);
          const listItem = userElement.querySelector('.popup__list-item');
          listItem.textContent = user.name;
          if (user.avatar) {
            listItem.style.backgroundImage = `url(${user.avatar})`;
          }
          cardInfoList.append(listItem);
        });
      } else {
        cardInfoText.textContent = 'Лайкнули: нет';
      }

      openModalWindow(cardInfoModalWindow);
    })
    .catch((err) => {
      console.log('Ошибка при загрузке информации о карточке:', err);
    });
};

// EventListeners
profileForm.addEventListener("submit", handleProfileFormSubmit);
cardForm.addEventListener("submit", handleCardFormSubmit);
avatarForm.addEventListener("submit", handleAvatarSubmit);

openProfileFormButton.addEventListener("click", () => {
  profileTitleInput.value = profileTitle.textContent;
  profileDescriptionInput.value = profileDescription.textContent;
  clearValidation(profileForm, validationSettings);
  openModalWindow(profileFormModalWindow);
});

profileAvatar.addEventListener("click", () => {
  avatarForm.reset();
  clearValidation(avatarForm, validationSettings);
  openModalWindow(avatarFormModalWindow);
});

openCardFormButton.addEventListener("click", () => {
  cardForm.reset();
  clearValidation(cardForm, validationSettings);
  openModalWindow(cardFormModalWindow);
});

//настраиваем обработчики закрытия попапов
const allPopups = document.querySelectorAll(".popup");
allPopups.forEach((popup) => {
  setCloseModalWindowEventListeners(popup);
});

// Включение валидации
enableValidation(validationSettings);

// Загрузка данных с сервера
Promise.all([getCardList(), getUserInfo()])
  .then(([cards, userData]) => {
    currentUserId = userData._id;
    
    profileTitle.textContent = userData.name;
    profileDescription.textContent = userData.about;
    profileAvatar.style.backgroundImage = `url(${userData.avatar})`;
    
    cards.forEach((cardData) => {
      const cardElement = createCard(cardData, handlePreviewPicture, currentUserId, handleDeleteCard, handleLikeCard, handleInfoClick);
      placesWrap.append(cardElement);
    });
  })
  .catch((err) => {
    console.log(err);
  });