import Image from "next/image";
import { Card, CardBody, Button } from "@nextui-org/react";
import { RiDownloadLine } from "react-icons/ri";
import JSZip from 'jszip';
import { saveAs } from 'file-saver';
import { useState } from "react";
import { motion, AnimatePresence } from 'framer-motion';
import { MdZoomInMap, MdZoomOutMap } from "react-icons/md";

export default function Output({ settings }) {
  const { isGenerating, generatedImage } = settings;
  const [isZoomed, setIsZoomed] = useState(false);
  const [zoomedImage, setZoomedImage] = useState(null);

  const handleZoom = (image) => {
    setZoomedImage(image);
    setIsZoomed(true);
  };

  const handleClose = () => {
    setIsZoomed(false);
    setZoomedImage(null);
  };

  const handleDownload = async () => {
    const zip = new JSZip();
    for (let i = 0; i < generatedImage.length; i++) {
      const url = generatedImage[i];
      if (url != "/default.avif") {
        const filename = `Image-${i + 1}.jpg`;
        try {
          const response = await fetch(url);
          const blob = await response.blob();
          zip.file(filename, blob);
        } catch (error) {
          console.error("Error adding file to zip:", error);
        }
      }
    }
    zip.generateAsync({ type: 'blob' }).then((content) => {
      saveAs(content, 'images.zip');
    });
  };

  return (
    <div className="flex justify-center items-center w-full  overflow-y-auto">
      <div className="relative w-[100%] max-h-[95vh]">
        {isGenerating && (
          <div className="flex flex-col items-center justify-center">
            <span className="loading loading-dots loading-md"></span>
            <p>Whipping up your words into art...</p>
          </div>
        )}
        {generatedImage?.length > 0 && (
          <Card>
            <CardBody >
              <div className="w-full">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-5">
                  {generatedImage.map((image, index) => (
                    <div key={index} className="lg:w-[300px] lg:h-[300px] xl:w-[400px] xl:h-[400px] monitor:h-[450px] relative group" style={{ marginLeft: "auto", marginRight: "auto" }}>
                      <Image
                        src={image}
                        alt={`Image ${index}`}
                        width={200}
                        height={200}
                        className="cursor-pointer object-cover w-full h-full"
                        onClick={() => handleZoom(image)}
                      />
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <MdZoomOutMap className="absolute top-0 left-0 m-4 bg-white rounded-3xl p-1 cursor-pointer" size={25} onClick={() => handleZoom(image)} />
                      </motion.div>
                    </div>
                  ))}
                </div>
              </div>
            </CardBody>
            <AnimatePresence>
              {isZoomed && (
                <motion.div
                  className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-75"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  onClick={handleClose}
                >
                  <motion.div
                    className="relative"
                    initial={{ scale: 0.8 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0.8 }}
                  >
                    <Image
                      src={zoomedImage}
                      alt="Zoomed Image"
                      width={650}
                      height={650}
                      sizes="100vw"
                    />
                    <MdZoomInMap className="absolute top-0 right-0 m-4 bg-white rounded-3xl p-1 cursor-pointer" size={30} onClick={handleClose} />
                  </motion.div>
                </motion.div>
              )}
            </AnimatePresence>
          </Card>
        )}
        {!isGenerating && generatedImage.length > 0 && (
          <Button
            className="fixed bottom-4 right-4 bg-white px-3 py-2 rounded-full shadow-md hover:bg-gray-100"
            onClick={handleDownload}
          >
            <RiDownloadLine size={18} />
            Download All
          </Button>
        )}
      </div>
    </div>
  )
}
