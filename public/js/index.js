const featureSection = document.querySelector(".featured");
const newSection = document.querySelector(".new");
const featureCategories = document.querySelector(".featured .categories");
const newCategories = document.querySelector(".new .categories");

const getDetails = (id) => {
	console.log(id);
	window.location.assign(`/api/products/${id}`);
};

const featuredObserver = new IntersectionObserver((entries) => {
	if (entries[0].isIntersecting) {
		if (!featureCategories.hasChildNodes()) {
			fetch("http://localhost:5000/api/products/featured")
				.then((res) => res.json())
				.then((data) => {
					data.message.forEach((product) => {
						let div = document.createElement("div");
						let img = new Image(150, 130);
						img.src = product.photos[0];
						img.onclick = () => {
							getDetails(product._id);
						};
						let p = document.createTextNode(product.category);
						let span = document.createTextNode(
							`${product.quantity} Devices`
						);

						div.appendChild(img);
						div.appendChild(p);
						div.appendChild(span);
						featureCategories.append(div);
					});
				})
				.catch((err) => console.log(err));
		}
	}
});

featuredObserver.observe(featureSection);

const newObserver = new IntersectionObserver((entries) => {
	if (entries[0].isIntersecting) {
		if (!newCategories.hasChildNodes()) {
			fetch("http://localhost:5000/api/products/new")
				.then((res) => res.json())
				.then((data) => {
					console.log(data);
					data.message.forEach((product) => {
						let div = document.createElement("div");
						let img = new Image(150, 130);
						img.src = product.photos[0];
						img.onclick = () => {
							getDetails(product._id);
						};
						let p = document.createTextNode(product.category);
						let span = document.createTextNode(
							`${product.quantity} Devices`
						);

						div.appendChild(img);
						div.appendChild(p);
						div.appendChild(span);
						newCategories.append(div);
					});
				})
				.catch((err) => console.log(err.message));
		}
	}
});

newObserver.observe(newSection);
