// src/scripts/components/card.js

export const likeCard = (likeButton, likeCount) => {
  likeButton.classList.toggle('card__like-button_is-active');
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

export const updateLikeState = (likeButton, likeCount, isLiked, likesCount) => {
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  } else {
    likeButton.classList.remove('card__like-button_is-active');
  }
  likeCount.textContent = likesCount;
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCard = (data, handlePreviewPicture, currentUserId, handleDeleteCard, handleLikeCard, handleInfoClick) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const infoButton = cardElement.querySelector(".card__control-button_type_info");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  // Проверяем, есть ли лайк от текущего пользователя
  const isLiked = data.likes.some(user => user._id === currentUserId);
  likeCount.textContent = data.likes.length;
  if (isLiked) {
    likeButton.classList.add('card__like-button_is-active');
  }

  // Показываем кнопку удаления только для автора
  if (data.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      handleDeleteCard(data._id, cardElement);
    });
  }

  // Кнопка информации
  if (handleInfoClick) {
    infoButton.addEventListener("click", () => {
      handleInfoClick(data._id);
    });
  }

  likeButton.addEventListener("click", () => {
    const isLiked = likeButton.classList.contains('card__like-button_is-active');
    handleLikeCard(data._id, likeButton, likeCount, isLiked);
  });

  if (handlePreviewPicture) {
    cardImage.addEventListener("click", () => {
      handlePreviewPicture({ name: data.name, link: data.link });
    });
  }

  return cardElement;
};