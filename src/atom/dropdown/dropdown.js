const dropdown = document.querySelector(".dropdown");
const dropdownBtn = dropdown.querySelector(".dropdown-btn");
const dropdownContent = dropdown.querySelector(".dropdown-content");

dropdownBtn.addEventListener("click", () => {
  dropdownContent.classList.toggle("show");
});

document.addEventListener("click", (e) => {
  if (!e.target.closet(".dropdown")) {
      dropdownContent.classList.remove("show");
    }
}); 

