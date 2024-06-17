"use client"
import { useState, useRef, useEffect } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { features } from "./data";
import Input from "@/components/Input";
import { textToImage } from "./data";
import Output from "@/components/Output";
import Image from "next/image";


const Feature = ({ feature, setFeature, settings, setFirstGen }) => {
  const { isGenerating } = settings
  return (
    <Select
      isDisabled={isGenerating}
      placeholder="Select a feature"
      selectedKeys={[feature]}
      style={{ backgroundColor: "white", borderRadius:"100px", paddingTop:"25px", paddingBottom:"25px" }}
      onSelectionChange={(keys) => { if (keys.currentKey) setFeature(keys.currentKey); setFirstGen(true); }}
    >
      {features.map((feature) => (
        <SelectItem key={feature.key} className="text-primary">
          {feature.label}
        </SelectItem>
      ))}
    </Select>

  )
}

export default function Home() {
  const [firstGen, setFirstGen] = useState(true)
  const [feature, setFeature] = useState("textToImage")
  const [settings, setSettings] = useState(textToImage)
  const divRef = useRef(null);

  const checkHeight = ()=>{
    const div = divRef.current;
    if (div) {
      const hasOverflow = div.scrollHeight > div.clientHeight;
      div.classList.toggle('md:justify-start', hasOverflow);
      div.classList.toggle('md:justify-center', !hasOverflow);
    }
  }

  useEffect(() => {
    checkHeight()
  }, [feature,settings]);

  return (
    <div className="flex h-screen  justify-center items-center">
      <div className={`w-full h-full overflow-y-auto custom-scroll md:overflow-y-hidden  md:w-auto grid grid-cols-1  ${!firstGen ? 'md:grid-cols-3 md:grid-flow-col' : 'md:grid-cols-1'}`}>
        <div 
          className={`flex flex-col h-full items-center md:overflow-y-auto custom-scroll  col-span-1 mt-3`}
          ref={divRef}
        >
          
          <div className="w-[95%] md:w-[250px] custom:w-[270px] lg:w-[330px] xl:w-[420px]">
            <Feature feature={feature} setFeature={setFeature} settings={settings} setFirstGen={setFirstGen} />
          </div>
          <div className="w-[95%] md:w-[250px] custom:w-[270px] lg:w-[330px] xl:w-[420px] mt-2 mb-2 md:mt-12">
            <Input feature={feature} settings={settings} setSettings={setSettings} setFirstGen={setFirstGen} checkHeight={checkHeight}/>
          </div>
        </div>
        {!firstGen &&
          <div className="flex mt-3 col-span-2">
            <Output settings={settings} />
          </div>
        }
      </div>
    </div>
  );
}
