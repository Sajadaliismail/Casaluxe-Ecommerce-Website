//prodcutDelete

if (window.location.pathname == "/admin/product") {
  $ondelete = $(".table tbody td  a.delete");
  $ondelete.click(function (event) {
    event.preventDefault();

    let id = $(this).attr("data-id");
    Swal.fire({
      title: "Are you sure?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Activate/Deactivate!",
    }).then((result) => {
      if (result.isConfirmed) {
        let request = {
          method: "POST",
        };

        fetch(`/admin/api/product/${id}`, request)
          .then((response) => {
            if (response.ok) {
              return response.json();
            } else {
              throw new Error("Acton failed");
            }
          })
          .then((data) => {
            Toast.fire({
              icon: "success",
              title: `Action done`,
            }).then(function () {
              location.reload();
            });
          })
          .catch((error) => {
            console.error("Error during action:", error);
            Swal.fire("Oops! Something went wrong.", "error");
          });
      } else {
        Toast.fire({
          icon: "info",
          title: `Action canceled`,
        });
      }
    });
  });
}

//image upload

if (window.location.pathname == "/admin/addproduct") {
  const form = document.getElementById("addproduct");
  let totalimages = 0;

  function imageupload(event) {
    const files = event.target.files;
    const imagecontainer = document.getElementById("imageContainer");
    const maximum = 5;

    const totalupload = totalimages + files.length;
    if (totalupload > maximum) {
      Swal.fire(`Oops! Upload only ${maximum} files.`, "Sorry");
      event.target.value = "";
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const reader = new FileReader();
      if (!file.type.startsWith("image/")) {
        console.log("File is not an image.", file.type);
        continue;
      }

      const imgdiv = document.createElement("div");
      imgdiv.classList.add("image-div");

      const img = document.createElement("img");
      img.style.height = "300px";
      img.style.width = "300px";
      img.setAttribute("name", `image`);
      img.classList.add("uploaded-image");

      const deletebutton = document.createElement("button");
      deletebutton.textContent = "Delete";
      deletebutton.classList.add("btn", "btn-danger", "m-2");

      deletebutton.addEventListener("click", function () {
        totalimages--;
        imgdiv.remove();
      });

      reader.onload = function (event) {
        img.src = event.target.result;

        const cropperdiv = document.createElement("div");
        cropperdiv.classList.add("cropper-container");
        cropperdiv.appendChild(img);

        imgdiv.appendChild(cropperdiv);
        const cropper = new Cropper(img, {
          dragMode: "move",
          aspectRatio: 1,
          autoCropArea: 0.8,
          restore: false,
          guides: false,
          center: false,
          responsive: true,
          highlight: false,
          cropBoxMovable: false,
          cropBoxResizable: false,
          toggleDragModeOnDblclick: false,
        });

        const cropbtn = document.createElement("button");
        cropbtn.classList.add("btn", "btn-primary", "m-2");
        cropbtn.textContent = "Crop";
        cropbtn.addEventListener("click", function (event) {
          event.preventDefault();
          const croppedCanvas = cropper.getCroppedCanvas();

          img.src = croppedCanvas.toDataURL();

          croppedCanvas.toBlob((blob) => {
            const fileName = Date.now();
            const file = new File([blob], `${fileName}.jpg`, {
              type: "image/jpeg",
            });

            if (window.FileList && window.DataTransfer) {
              const dataTransfer = new DataTransfer();
              dataTransfer.items.add(file);
              const input = document.createElement("input");
              input.type = "file";
              input.name = `image${i}`;
              input.files = dataTransfer.files;
              form.appendChild(input);
              input.style.display = "none";
            } else {
              console.error(
                "FileList and DataTransfer are not supported in this browser."
              );
            }
          });
          cropper.destroy();
          cropbtn.remove();
        });

        imgdiv.appendChild(cropbtn);
        imgdiv.appendChild(deletebutton);
      };

      reader.readAsDataURL(file);

      imagecontainer.appendChild(imgdiv);
    }
    totalimages = totalupload;
  }
  const imageInput = document.getElementById("imageInput");

  imageInput.addEventListener("change", imageupload);
}

//editproduct
if (window.location.pathname.startsWith("/admin/api/editproduct/")) {
  const form = document.getElementById("editproduct");

  for (let i = 0; i < 5; i++) {
    const button = document.getElementById(`button${i}`);
    const input = document.getElementById(`input${i}`);
    const image = document.getElementById(`image${i}`);
    const oldimage = document.getElementById(`oldimage${i}`);

    const deletebtn = document.getElementById(`deletebutton${i}`);
    if (deletebtn) {
      deletebtn.addEventListener("click", () => {
        image.src = "";
        image.style.display = "none";
        deletebtn.style.display = "none";
        button.textContent = "Add";
        oldimage.disabled = true;
      });
    }
    if (button) {
      button.addEventListener("click", function () {
        input.click();
      });
      input.dataset.index = i;
      input.addEventListener("change", uploaded);
    }
  }

  function uploaded(event) {
    const file = event.target.files[0];
    const button = document.getElementById(
      `button${event.target.dataset.index}`
    );
    const oldimage = document.getElementById(
      `oldimage${event.target.dataset.index}`
    );
    const image = document.getElementById(`image${event.target.dataset.index}`);
    const imgdiv = document.getElementById(
      `imgdiv${event.target.dataset.index}`
    );
    const deletebtn = document.getElementById(
      `deletebutton${event.target.dataset.index}`
    );

    if (oldimage) {
      oldimage.disabled = true;
    }

    image.style.display = "flex";
    button.textContent = "Change";
    deletebtn.style.display = "flex";
    const reader = new FileReader();

    reader.onload = function (event) {
      image.src = event.target.result;
      const cropperdiv = document.createElement("div");
      cropperdiv.classList.add("cropper-container");
      cropperdiv.appendChild(image);

      imgdiv.appendChild(cropperdiv);

      const cropper = new Cropper(image, {
        dragMode: "move",
        aspectRatio: 1,
        autoCropArea: 0.8,
        restore: false,
        guides: false,
        center: false,
        highlight: false,
        cropBoxMovable: false,
        cropBoxResizable: false,
        toggleDragModeOnDblclick: false,
      });

      const cropbtn = document.createElement("button");
      cropbtn.classList.add("btn", "btn-primary", "m-2");
      cropbtn.textContent = "Crop";
      cropbtn.addEventListener("click", function (event) {
        event.preventDefault();
        const croppedCanvas = cropper.getCroppedCanvas();

        image.src = croppedCanvas.toDataURL();

        croppedCanvas.toBlob((blob) => {
          const fileName = Date.now();
          const file = new File([blob], `${fileName}.jpg`, {
            type: "image/jpeg",
          });

          if (window.FileList && window.DataTransfer) {
            const dataTransfer = new DataTransfer();
            dataTransfer.items.add(file);
            const input = document.createElement("input");
            input.type = "file";
            input.name = `image${event.target.dataset.index}`;
            input.files = dataTransfer.files;
            form.appendChild(input);
            input.style.display = "none";
          } else {
            console.error(
              "FileList and DataTransfer are not supported in this browser."
            );
          }
        });
        cropper.destroy();
        cropbtn.remove();
      });

      imgdiv.appendChild(cropbtn);
    };

    reader.readAsDataURL(file);
  }
}