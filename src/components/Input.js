"use client"
import Image from "next/image";
import { useEffect, useState, useCallback, useRef } from "react";
import { Select, SelectItem, Card, CardBody, Textarea, Accordion, AccordionItem, Slider, Button } from "@nextui-org/react";
import { ratios, styles, goJourney, faceToMany, stickerMaker, textToImage, personalize, imageToImage, modelsT2I, models } from "../app/data";
import { AiOutlineClose } from "react-icons/ai";
import { generateFaceToMany, generateGoJourney, generateStickerMaker, generateTextToImage, generatePersonalize, generateImageToImage } from "@/utils/ApiCaller";

const Advanced = ({ uid, secretKey, seed, updateSettings }) => {
  return (
    <Accordion variant="splitted">
      <AccordionItem key="1" aria-label="Advanced" title={<span className="text-sm">Advanced</span>}>
        <div className="flex flex-col gap-4">
          <Textarea
            label="Specify an UID"
            placeholder="Enter specify an UID"
            value={uid}
            onChange={(event) => updateSettings("uid", event.target.value)}
          />
          <Textarea
            label="Secret key"
            placeholder="Enter secret key"
            value={secretKey}
            onChange={(event) => updateSettings("secretKey", event.target.value)}
          />
          <Textarea
            label="Seed"
            placeholder="Enter seed"
            value={seed}
            onChange={(event) => updateSettings("seed", event.target.value)}
          />
        </div>
      </AccordionItem>
    </Accordion>
  )
}

const ScaleSlide = ({ scale, title, attribute, updateSettings }) => {
  const handleChange = (value) => {
    updateSettings(attribute, value)
  };
  return (
    <Slider
      label={title}
      size="sm"
      color="foreground"
      step={0.1}
      maxValue={1}
      minValue={0}
      value={scale}
      className="max-w-md"
      onChange={handleChange}
    />
  )
}

const ImageUpload = ({ image, title, attribute, updateSettings }) => {
  const fileInputRef = useRef(null);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    processFile(file);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    processFile(file);
  }, []);

  const triggerFileSelect = () => {
    fileInputRef.current.click();
  };

  const removeFile = () => {
    updateSettings(attribute, null);
    fileInputRef.current.value = '';
  };

  const processFile = (file) => {
    if (file) {
      const reader = new FileReader();
      reader.onload = function (event) {
        // The result attribute contains the data URL, which is base64 encoded
        const base64String = event.target.result;
        const fileSize = (file.size / 1024).toFixed(2);
        updateSettings(attribute, { base64String: base64String, name: file.name, size: fileSize })
      };
      reader.readAsDataURL(file); // Convert the file to a data URL
    }
  };

  return (
    <div className="flex justify-center items-center">
      <div className="max-w-md w-full">
        <div className="text-sm mb-1">{title}</div>
        <Card
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          className="border-dashed border-2 border-gray-300 p-6 text-center"
        >
          <div className="flex flex-col items-center justify-center h-40">
            <div className="text-4xl cursor-pointer" onClick={triggerFileSelect}>+</div>
            <p className="mt-2">Drag and drop file here</p>
            <p className="text-gray-500 mt-1">Limit 200MB per file (JPG, PNG, JPEG)</p>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileChange}
              style={{ display: 'none' }}
              id="file-input"
              accept=".jpg, .jpeg, .png"
            />
          </div>
        </Card>
        {
          image &&
          <div className="relative w-full h-full mt-2">
            <Image src={image.base64String} width={0} height={0} className="w-full h-full object-cover rounded-2xl" alt="Uploaded image" />
            <button onClick={removeFile} className="absolute top-2 right-2 bg-white rounded-full p-1 shadow-md">
              <AiOutlineClose size={20} />
            </button>
          </div>
        }
      </div>
    </div>
  );
}

const Style = ({ style, updateSettings }) => {
  return (
    <Select
      label="Style"
      placeholder="Select a style"
      selectedKeys={[style]}
      style={{ backgroundColor: "white" }}
      onSelectionChange={(keys) =>{ if (keys.currentKey) updateSettings("style", keys.currentKey)}}
    >
      {styles.map((st) => (
        <SelectItem key={st.key} className="text-primary">
          {st.label}
        </SelectItem>
      ))}
    </Select>
  )
}

const Prompt = ({ prompt, updateSettings }) => {

  const handleChange = (event) => {
    updateSettings("prompt", event.target.value);
  };

  return (
    <Textarea
      label="Prompt"
      placeholder="Enter your prompt"
      value={prompt}
      onChange={handleChange}
    />
  )
}

const NegativePrompt = ({ negativePrompt, updateSettings }) => {

  const handleChange = (event) => {
    updateSettings("negativePrompt", event.target.value);
  };

  return (
    <Textarea
      label="Negative Prompt"
      placeholder="Enter your negative prompt"
      value={negativePrompt}
      onChange={handleChange}
    />
  )
}

const Models = ({ models, model, updateSettings }) => {
  return (
    <Select
      label="Style"
      placeholder="Select a style"
      selectedKeys={[model]}
      style={{ backgroundColor: "white" }}
      onSelectionChange={(keys) =>{ if (keys.currentKey) updateSettings("model", keys.currentKey)}}
    >
      {models.map((md) => (
        <SelectItem key={md.key} className="text-primary">
          {md.label}
        </SelectItem>
      ))}
    </Select>
  )
}

const Ratios = ({ ratio, updateSettings }) => {
  return (
    <Select
      label="Style"
      placeholder="Select a style"
      selectedKeys={[ratio]}
      style={{ backgroundColor: "white" }}
      onSelectionChange={(keys) =>{if (keys.currentKey) updateSettings("ratio", keys.currentKey)}}
    >
      {ratios.map((rt) => (
        <SelectItem key={rt.key} className="text-primary">
          {rt.label}
        </SelectItem>
      ))}
    </Select>
  )
}

export default function Input({ feature, settings, setSettings, setFirstGen }) {
  const { model, ratio, negativePrompt, uid, secretKey, seed, poseImage, image, ipScale, controlScale, style, isGenerating, status, prompt } = settings;
  const [error, setError] = useState("")


  const updateSettings = (attribute, value) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      [attribute]: value,
    }));
  };


  const check = () => {
    setError("")
    if (!prompt) {
      setError("Please fill in Prompt field")
      return false
    }
    if (feature == "faceToMany" || feature == "imageToImage" ) {
      if (!image) {
        setError("Please upload an image")
        return false
      }
    }

    if (feature=="personalize"){
      if (!image) {
        setError("Please upload an image that contains face")
        return false
      }
      if (!poseImage) {
        setError("Please upload an image that contains pose")
        return false
      }
    }

    return true
  }

  const generate = async () => {
    if (!check())
      return
    setFirstGen(false)
    switch (feature) {
      case "goJourney":
        generateGoJourney(settings, setSettings)
        break;
      case "faceToMany":
        generateFaceToMany(settings, setSettings)
        break;
      case "stickerMaker":
        generateStickerMaker(settings, setSettings)
        break;
      case "textToImage":
        generateTextToImage(settings, setSettings)
        break;
      case "personalize":
        generatePersonalize(settings, setSettings)
        break;
      case "imageToImage":
        generateImageToImage(settings, setSettings)
        break;
    }
  }

  useEffect(() => {
    setError("")
    switch (feature) {
      case "goJourney":
        setSettings(goJourney)
        break;
      case "faceToMany":
        setSettings(faceToMany)
        break;
      case "stickerMaker":
        setSettings(stickerMaker)
        break;
      case "textToImage":
        setSettings(textToImage)
        break;
      case "personalize":
        setSettings(personalize)
        break;
      case "imageToImage":
        setSettings(imageToImage)
        break;
    }
  }, [feature])


  return (
    <Card className="overflow-y-auto max-h-[70vh]">
      <CardBody >
        <div className="flex flex-col gap-4">
          {
            feature == "textToImage" && <Models models={modelsT2I} model={model} updateSettings={updateSettings} />
          }
          {
            (feature == "personalize" || feature == "imageToImage") && <Models models={models} model={model} updateSettings={updateSettings} />
          }
          <Prompt prompt={prompt} updateSettings={updateSettings} />
          {
            feature == "textToImage" && <Ratios ratio={ratio} updateSettings={updateSettings} />
          }
          {feature == "faceToMany" &&
            <>
              <Style style={style} updateSettings={updateSettings} />
              <ImageUpload image={image} title="Upload an image" attribute="image" updateSettings={updateSettings} />
            </>
          }
          {feature == "imageToImage" &&
            <>
              <ImageUpload image={image} title="Upload an image" attribute="image" updateSettings={updateSettings} />
            </>
          }
          {feature == "personalize" &&
            <>
              <ImageUpload image={image} title="Upload your image that contains face" attribute="image" updateSettings={updateSettings} />
              <ImageUpload image={poseImage} title="Upload your image that contains pose" attribute="poseImage" updateSettings={updateSettings} />
              <ScaleSlide scale={ipScale} title="IP Adapter Scale" attribute="ipScale" updateSettings={updateSettings} />
              <ScaleSlide scale={controlScale} title="ControlNet Scale" attribute="controlScale" updateSettings={updateSettings} />
            </>
          }
          {
            (feature == "textToImage" || feature == "personalize" || feature == "imageToImage") &&
            <NegativePrompt negativePrompt={negativePrompt} updateSettings={updateSettings} />
          }
          <Advanced uid={uid} secretKey={secretKey} seed={seed} updateSettings={updateSettings} />
          <Button className="bg-black transition duration-150 ease-in-out text-white" isDisabled={isGenerating} onClick={generate}>
            Generate
          </Button>
          {
            error &&
            <div role="alert" className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>{error}</span>
            </div>
          }
          {
            status === "Task failed" &&
            <div role="alert" className="alert alert-error">
              <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>
              <span>An error occurred while processing your request. Please check your input.</span>
            </div>
          }
        </div>
      </CardBody>
    </Card>
  )
}
