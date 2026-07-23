const CARD_SELECTOR = ".card, .steam-block";
const WRAPPER_CLASS = "card-image-clip";

function wrapCardImage(media) {
  if (media.parentElement?.classList.contains(WRAPPER_CLASS)) return;

  const image = media.matches("img") ? media : media.querySelector("img");
  const wrapper = document.createElement("div");

  wrapper.className = WRAPPER_CLASS;

  if (image) {
    const imageStyles = window.getComputedStyle(image);

    wrapper.style.borderTopLeftRadius = imageStyles.borderTopLeftRadius;
    wrapper.style.borderTopRightRadius = imageStyles.borderTopRightRadius;
    wrapper.style.borderBottomRightRadius = imageStyles.borderBottomRightRadius;
    wrapper.style.borderBottomLeftRadius = imageStyles.borderBottomLeftRadius;
  }

  media.before(wrapper);
  wrapper.append(media);
}

export function initCardImageHover() {
  document.querySelectorAll(CARD_SELECTOR).forEach((card) => {
    const cardMedia = new Set(
      Array.from(card.querySelectorAll("img"), (image) =>
        image.closest("picture") ?? image,
      ),
    );

    cardMedia.forEach(wrapCardImage);
  });
}
