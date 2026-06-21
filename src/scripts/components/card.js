// src/scripts/components/card.js

export const likeCard = (likeButton, likeCount) => {
  likeButton.classList.toggle('card__like-button_is-active');
};

export const deleteCard = (cardElement) => {
  cardElement.remove();
};

const getTemplate = () => {
  return document
    .getElementById("card-template")
    .content.querySelector(".card")
    .cloneNode(true);
};

export const createCard = (data, handlePreviewPicture, currentUserId, handleDeleteCard, handleLikeCard) => {
  const cardElement = getTemplate();
  const likeButton = cardElement.querySelector(".card__like-button");
  const deleteButton = cardElement.querySelector(".card__control-button_type_delete");
  const cardImage = cardElement.querySelector(".card__image");
  const likeCount = cardElement.querySelector(".card__like-count");

  cardImage.src = data.link;
  cardImage.alt = data.name;
  cardElement.querySelector(".card__title").textContent = data.name;

  // Отображение количества лайков
  if (likeCount) {
    likeCount.textContent = data.likes.length;
  }

  // Показываем кнопку удаления только для автора
  if (data.owner._id !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      handleDeleteCard(data._id, cardElement);
    });
  }

  likeButton.addEventListener("click", () => {
    handleLikeCard(data._id, likeButton, likeCount);
  });

  if (handlePreviewPicture) {
    cardImage.addEventListener("click", () => {
      handlePreviewPicture({ name: data.name, link: data.link });
    });
  }

  return cardElement;
};