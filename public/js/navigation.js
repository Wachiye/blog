let navSlider = () => {
	let burger = document.querySelector('.burger')
	let nav = document.querySelector('.nav-links')
	let navLinks = document.querySelectorAll('.nav-links li')

	burger.addEventListener("DOMContentLoaded",'click', () => {
		//toggle nav
		nav.classList.toggle('nav-active');

		//add animationto links
		//animate links
		navLinks.forEach((link, index) => {
			if (link.style.animation) {
				link.style.animation = ''
			} else {
				link.style.animation = `navLinkFade 0.5s ease forwards ${index / 7 + 0.5}s`
			}
		})

		//burger animation
		burger.classList.toggle('toggle')
	})
	
}

navSlider()