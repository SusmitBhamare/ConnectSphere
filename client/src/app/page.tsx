"use client";
import { Button } from "@/components/ui/button";
import axios from "axios";
import Link from "next/link";
import React, { useEffect, useState } from "react";
import { MdArrowRight, MdArrowUpward } from "react-icons/md";
import { WobbleCard } from "@/components/ui/wobble-card";
import features from "./data/features.json";
import {
  FaEnvelope,
  FaGithub,
  FaSquare,
  FaSquareGithub,
} from "react-icons/fa6";
import { Separator } from "@/components/ui/separator";
import { BackgroundBeams } from "@/components/ui/background-beans";

function HomePage() {
  axios.defaults.withCredentials = true;

  return (
    <div className="max-w-screen">
      <Hero />
      <Features />
      <footer className="bg-neutral-900 text-muted-foreground md:justify-items-center  gap-y-4 min-h-40 grid grid-cols-1 md:grid-cols-2 py-4 px-16">
        <div>
          <Link
            href="https://github.com/Mehulparekh144/Gather"
            className="flex gap-2 my-2 items-center"
            target="_blank"
          >
            <FaGithub className="h-5 w-5" />{" "}
            <p className="text-base text-muted-foreground">
              Contribute to Gather
            </p>
          </Link>
          <Link
            href="mailto:mehulparekh144@gmail.com"
            className="flex gap-2 my-2 items-center"
          >
            <FaEnvelope className="h-5 w-5" />
            <p className="text-base text-muted-foreground">Contact me</p>
          </Link>
          <p className="text-sm mt-2">
            &copy; 2024 Mehul Parekh. All rights reserved.
          </p>
        </div>
        <div className="">
          <h1 className="text-lg font-semibold">About the developer</h1>
          <p>
            Hey, I'm a Graduate Computer Science student from Boston with a
            passion for full-stack development projects. I'm always open to
            collaboration, so feel free to reach out!
          </p>
          <div className="flex text-sm items-center gap-1">
            View my other projects <MdArrowRight />{" "}
            <Link href={"https://mehulparekh.vercel.app"} className="underline">
              Portfolio
            </Link>
          </div>
        </div>
      </footer>
      <BackgroundBeams/>
    </div>
  );
}

const Hero = () => {
  return (
    <div className="flex h-max flex-col justify-start gap-4 items-center mt-32 mb-16 relative">
      <h1 className="text-3xl md:text-5xl lg:text-7xl font-display font-semibold">
        Gather and Thrive
      </h1>
      <h1 className="text-base md:text-2xl lg:text-3xl text-balance w-3/4 text-center">
        Transform how your team collaborates with Gather <br /> where seamless
        communication meets effortless productivity.
      </h1>
      <div className="flex gap-2 items-center">
        <Button
          size={"lg"}
          variant={"secondary"}
          className="flex gap-2 z-10 items-center group"
          asChild
        >
          <Link href={"/register"}>
            Get Started{" "}
            <MdArrowUpward className="group-hover:rotate-90 transition-all delay-150" />
          </Link>
        </Button>
        <Button size={"lg"} variant={"default"} className="z-10">
          View Demo
        </Button>
      </div>
    </div>
  );
};

const Features = () => {
  return (
    <section className="max-w-screen grid grid-cols-1 md:grid-cols-2 gap-4 mb-8 px-4 md:px-16 lg:px-64">
      {features.features.map((feature, idx) => {
        return (
          <WobbleCard containerClassName={feature.color} key={idx}>
            <h1 className="text-lg md:text-2xl">{feature?.feature_title}</h1>
            <p>{feature.feature_description}</p>
          </WobbleCard>
        );
      })}
    </section>
  );
};

export default HomePage;
