import React, { useState, useEffect } from "react";
import "./index.css";
import "./App.css";
import ipfsHashes from "./ipfsHashes.json";
import placeholderImage from "./Logo_Negro.png";


const Loader = () => <div className="loader">Loading...</div>;

const App: React.FC = () => {
  useEffect(() => {
    const fetchImages = async () => {
      try {
        const imageList = ipfsHashes.map((item) => ({
          name: item.name,
          url: `https://gateway.pinata.cloud/ipfs/${item.hash}`
        }));

        setImages(imageList);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  const [images, setImages] = useState<{ name: string; url: string }[]>([]);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  const handleDownload = (url: string, filename: string) => {
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]));
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", `${filename}.png`); // Specify the file extension here
        document.body.appendChild(link);
        link.click();
        link.parentNode?.removeChild(link);
      })
      .catch((error) => console.error("Error downloading image:", error));
  };

  const handleImageError = (index: number) => {
    const updatedImages = [...images];
    updatedImages[index].url = placeholderImage; // Replace the broken image URL with the placeholder image
    setImages(updatedImages);
  };

  const filteredImages = images.filter((image) =>
    image.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="App">
      <div className="container">
        <header className="header-container">
          <img src={placeholderImage} alt="Centered Image" className="centered-image" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by name..."
            className="searchInput"
          />
        </header>

        {loading ? (
          <Loader />
        ) : (
          <main>
            <div className="container">
              <div className="imageContainer">
                {filteredImages.map((image, index) => (
                  <div className="imageWrapper" key={index}>
                    <img
                      src={image.url}
                      alt={image.name}
                      className="image"
                      onError={() => handleImageError(index)} // Handle image loading errors
                    />
                    <button
                      className="downloadButton"
                      onClick={() => handleDownload(image.url, image.name)}
                    >
                      Download
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </main>
        )}
      </div>
    </div>
  );
};

export default App;
