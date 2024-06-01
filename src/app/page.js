"use client"
import { useState, useRef } from "react";
import { Select, SelectItem } from "@nextui-org/react";
import { features } from "./data";
import Input from "@/components/Input";
import { textToImage } from "./data";
import Output from "@/components/Output";
import Image from "next/image";


const Feature = ({ feature, setFeature, settings, setFirstGen }) => {
  const {isGenerating} = settings
  return (
    <Select
      isDisabled={isGenerating}
      label="Feature"
      placeholder="Select a feature"
      selectedKeys={[feature]}
      style={{ backgroundColor: "white" }}
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

  return (
    <div className="flex justify-center items-center ">
      <div className={`w-full grid grid-cols-1 ${!firstGen ? 'md:grid-cols-3 md:grid-flow-col' : 'md:grid-cols-1'} gap-2 md:gap-0`}>
        <div className="flex flex-col justify-center items-center col-span-1 relative h-screen">
          <div className="w-[95%] md:w-[250px] custom:w-[270px] lg:w-[330px] xl:w-[420px] mt-3">
            <Feature feature={feature} setFeature={setFeature} settings={settings} setFirstGen={setFirstGen} />
          </div>
          <div className="w-[95%] md:w-[250px] custom:w-[270px] lg:w-[330px] xl:w-[420px] mt-2 mb-2 md:mt-12">
            <Input feature={feature} settings={settings} setSettings={setSettings} setFirstGen={setFirstGen} />
          </div>
          <Image
            src="/Logo.svg"
            alt="Logo"
            width={150}
            height={150}
            sizes="100vw"
            className="hidden md:block absolute bottom-0 left-0 m-6 hide-on-small-height"
          />
        </div>
        {!firstGen &&
          <div className="flex justify-center items-center col-span-2">
            <Output settings={settings} />
          </div>
        }
      </div>
    </div>
  );
}
