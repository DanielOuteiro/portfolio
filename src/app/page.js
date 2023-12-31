"use client";

import * as React from "react";
import { useState, useEffect } from "react";
import { NextUIProvider } from "@nextui-org/react";
import Spline from "@splinetool/react-spline";
import Balls from "./components/balls";
import Works from "./components/works";
import WorksMobile from "./components/works_mobile";
import Hello from "./components/hello";

import ContactForm from "./components/contactform";
import { Card, CardBody, Divider } from "@nextui-org/react";
import Blobity from "blobity";

import PlausibleProvider from "next-plausible";

export default function Home() {
  useEffect(() => {
    if (typeof window !== "undefined") {
      const blobity = new Blobity({
        licenseKey: "opensource",
        dotColor: "#000",
        focusableElementsOffsetX: 2,
        focusableElementsOffsetY: 2,
        opacity: 0.15,
        magnetic: true,      
      });
    }
  }, []); 

  return (
    <>
      <PlausibleProvider domain="danieloitei.ro">
        <NextUIProvider
          className="bg-white w-full text-black"
        >
          <div className="min-h-screen">
            <div className=" px-20 py-10 w-full bg-white  flex-row  justify-between items-center inline-flex">
              <div className=" mr-2 md:mr-44">
                <span className=" text-xl  md:text-3xl max-w-5xl lg:max-w-4xl leading-tight">
                  <span style={{ fontWeight: "bold" }}>
                    I am Daniel Oiteiro
                  </span>{" "}
                  and I thrive in crafting seamless experiences that delight
                  users and drive business growth.
                </span>
              </div>
              <div className="basis-1/4"></div>
            </div>

            <div
              className="hidden md:block"
              style={{ width: "100vw", height: "80vh" }}
            >
              <Hello />
            </div>

            <div className="md:hidden py-36">
              <video autoPlay loop muted playsInline>
                <source src="./videos/hello.mp4" type="video/mp4" />
              </video>
            </div>
          </div>
          <div className="px-20 pb-12 text-4xl md:text-6xl leading-tight">
            10+ years of UX expertise
          </div>

          <div className="hidden lg:block py-20 pt-40">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100vw",
                  height: "50vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100vw", height: "80vh" }}
                >
                  <source src="./videos/history_lg.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          <div className="hidden lg:hidden md:block py-20">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100vw",
                  height: "50vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100vw", height: "60vh" }}
                >
                  <source src="./videos/history_md.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          <div className="md:hidden py-20 pt-40">
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "100vw",
                  height: "50vh",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  style={{ width: "100vw", height: "100vh" }}
                >
                  <source src="./videos/history_sm.mp4" type="video/mp4" />
                </video>
              </div>
            </div>
          </div>

          <div className="px-20 pt-44 text-4xl md:text-6xl leading-tight">
            Featured Work
          </div>
          <div className="hidden md:block min-h-screen scroll-smooth self-center">
            <Works />
          </div>
          <div className="md:hidden -mt-16 md:mt-0 min-h-screen scroll-smooth">
            <WorksMobile />
          </div>
          <div className="px-20 pt-44 text-4xl md:text-6xl leading-tight	">
            Fusing tools and ideas
          </div>
          <div
            className="hidden md:block"
            style={{ width: "100vw", height: "100vh" }}
          >
            <Balls />
          </div>
          <div className="md:hidden">
            <video autoPlay muted playsInline>
              <source src="./videos/balls.mp4" type="video/mp4" />
            </video>
          </div>
          <div className="px-20 pt-44 text-4xl md:text-6xl leading-none">
            <div className="flex flex-col">
              <div>Have an idea?</div>
              <div>
                <span style={{ fontWeight: "bold" }}>Let’s chat about it</span>
              </div>
            </div>
          </div>
          <div className="md:pb-0">
            <ContactForm />
          </div>
          <div className="md:block hidden max-w-screen md:pb-0">
            <Spline scene="https://prod.spline.design/3fIun2Ia365Y7UtH/scene.splinecode" />
          </div>
          <div className="px-20 text-4xl md:text-sm pt-64 md:pt-0 leading-none">
            <Card shadow="none">
              <CardBody>
                <p className="text-large">
                  {" "}
                  Concept, design and code by Daniel Oiteiro.
                </p>
              </CardBody>
            </Card>
          </div>
        </NextUIProvider>
      </PlausibleProvider>
    </>
  );
}
