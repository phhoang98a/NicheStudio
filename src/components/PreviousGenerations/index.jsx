"use client";

import { useState } from "react";
import Image from "next/image";
import { FaAnglesRight } from "react-icons/fa6";
import { AiOutlineClose } from "react-icons/ai";
import clsx from "clsx";

const PreviousGenerations = ({ storage, isGenerating, setFeature, setSettings, setFirstGen, setStorage }) => {
	const [isReveal, setIsReveal] = useState(false);

	const handleSelect = (key, value) => {
		if (isGenerating) return;
		const feature = key.split("_").at(0);
		setFeature(feature);
		setSettings(value);
		setFirstGen(false);
		setIsReveal(false);
	}

	const removeSetting = (key) => {
		const newStorage = { ...storage };
		delete newStorage[key];
		setStorage(newStorage);
		localStorage.setItem("settings", JSON.stringify(newStorage));
	}

	return (
		<div
			className={clsx(
				"fixed top-1/2 -translate-y-1/2 p-3 bg-white rounded-r-lg shadow transition-all z-50",
				isReveal ? "left-0" : "-left-[232px]",
			)}
		>
			<div className="w-52 max-h-[400px] overflow-y-auto flex flex-col gap-3">
				{Object.entries(storage).map(([key, value]) => (
					<button key={key} onClick={() => handleSelect(key, value)}
						className="flex-shrink-0 rounded-lg overflow-hidden relative"
					>
						<Image src={value.generatedImage.at(-1)} alt={key}
							width={208}
							height={208}
							className="object-cover w-full aspect-square" />
						<span onClick={(e) => {
							e.stopPropagation();
							removeSetting(key)
						}}
							className="absolute top-0 right-0 bg-white p-1 rounded-bl-lg cursor-pointer hover:bg-gray-100 transition-all"
						>
							<AiOutlineClose />
						</span>
					</button>
				))}
			</div>
			{Object.entries(storage).length > 0 &&
				<button
					onClick={() => setIsReveal(!isReveal)}
					className="absolute top-1/2 -translate-y-1/2 -right-10 w-10 h-10 bg-white rounded-r-2xl p-2 flex justify-center items-center"
				>
					<FaAnglesRight className={clsx("transition-all", isReveal ? "rotate-180" : "")} />
				</button>
			}
		</div>
	);
};

export default PreviousGenerations;
