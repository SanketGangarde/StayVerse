(() => {
  'use strict'

  // Fetch all the forms we want to apply custom Bootstrap validation styles to
  const forms = document.querySelectorAll('.needs-validation')

  // Loop over them and prevent submission
  Array.from(forms).forEach(form => {
    form.addEventListener('submit', event => {
      if (!form.checkValidity()) {
        event.preventDefault()
        event.stopPropagation()
      }

      form.classList.add('was-validated')
    }, false)
  })
})()





//------------------------------------------------------------------------------------------

// ADD Another image
function addAnotherImageInput() {
  const container = document.getElementById('image-inputs');

  const input = document.createElement('input');
  input.type = 'file';
  input.name = 'images';
  input.accept = 'image/*';
  input.className = 'form-control mb-2';
  // input.onchange = function () { //not required after checking delete it
  //   previewSelectedFiles(this);
  // };

  container.appendChild(input);
}

//------------------------------------------------------------------------------------------

//show.ejs

 let galleryImages = [];
  let currentImageIndex = 0;

  function openGallery(images) {
    galleryImages = images;
    currentImageIndex = 0;
    showImage();
    document.getElementById("galleryModal").style.display = "flex";

    /*
       Purpose: Opens the gallery modal and displays the first image.

        How it works:

        Sets galleryImages to the array of images passed to the function.

        Resets currentImageIndex to 0 (first image).

        Calls showImage() to display the first image.

        Sets the modal’s display style to "flex" to make it visible (assuming CSS uses display: flex for the modal).
    */
  }

  function closeGallery() {
    document.getElementById("galleryModal").style.display = "none";
    // Purpose: Hides the gallery modal.
    // How it works: Sets the modal’s display style to "none", making it invisible.
  }

  function showImage() {
    const modalImage = document.getElementById("modalImage");
    modalImage.src = galleryImages[currentImageIndex].url;
  }

  function nextImage() {
    currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
    showImage();
  }

  function prevImage() {
    currentImageIndex =
      (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
    showImage();
  }

  // Optional: Close modal on Escape key
  document.addEventListener("keydown", function (event) {
    if (event.key === "Escape") {
      closeGallery();
    }
  });


// blurr past dates
const checkinInput = document.getElementById("checkin");
const checkoutInput = document.getElementById("checkout");

const today = new Date().toISOString().split("T")[0];
checkinInput.setAttribute("min", today);
checkoutInput.setAttribute("min", today);


   
 
