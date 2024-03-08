import React, { useState, useEffect } from "react";
import "./index.css";
import "./App.css";

// Constants
const TWITTER_HANDLE = "BtcBangers";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const App: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    const fetchImages = async () => {
      try {
        // Array of IPFS hashes of your images
        const ipfsHashes = ["QmTAz29LdJYL1f9jJ17yqyWP4AM7oM1WkyNWZCJTYjypFR", "QmaDco16foDUsqaTBBHhFGdDtMqXGrjDckLfD1ff1XcPtH", "QmYqWddbLb1TKvKfP5KFRjjes6cM5tqVgrdzoRBQwWZuXU"]; // Replace with your actual hashes

        // Construct URLs for fetching images
        const imageUrls = ipfsHashes.map((hash) => `https://gateway.pinata.cloud/ipfs/${hash}`);

        // Set the image URLs in state
        setImages(imageUrls);
      } catch (error) {
        console.error("Error fetching images:", error);
      }
    };

    fetchImages();
  }, []);

  return (
    <div className="App">
      <div className="container">
        <header className="header-container">
          <h1 className="header"> Bangers </h1>
        </header>

        <main>
          <div className="container"> {/* Apply container class from app.css */}
            <div className="imageContainer"> {/* Apply imageContainer class from app.css */}
              {images.map((imageUrl, index) => (
                <div className="imageWrapper" key={index}> {/* Apply imageWrapper class from app.css */}
                  <img src={imageUrl} alt={`Image ${index}`} className="image" /> {/* Apply image class from app.css */}
                  <div className="buttonContainer"> {/* Apply buttonContainer class from app.css */}
                    <button className="ctaButton" onClick={() => handleDownload(imageUrl)}>Download</button> {/* Apply ctaButton class from app.css */}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <div className="footer-container">
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`follow @${TWITTER_HANDLE}`}</a>
        </div>
      </div>
    </div>
  );
};

const handleDownload = async (imageUrl: string) => {
  try {
    // Remove query parameters from the image URL
    const cleanUrl = imageUrl.split("?")[0];

    // Fetch the image data
    const response = await fetch(cleanUrl);
    const blob = await response.blob();

    // Create a URL for the image data
    const url = URL.createObjectURL(blob);

    // Create a temporary anchor element
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `image${Date.now()}`); // Set a default filename
    document.body.appendChild(link);

    // Programmatically trigger the download
    link.click();

    // Remove the temporary anchor element
    document.body.removeChild(link);
  } catch (error) {
    console.error("Error downloading image:", error);
  }
};

export default App;
