import satori from "satori";
import { SITE } from "@/config";
import loadLocalFonts from "../loadLocalFonts";

export default async post => {
  return satori(
    {
      type: "div",
      props: {
        style: {
          background: "#f5f4ed",
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontFamily: "LXGW WenKai",
        },
        children: [
          {
            type: "div",
            props: {
              style: {
                position: "absolute",
                left: 118,
                top: 96,
                width: 5,
                height: 438,
                background: "#1B365D",
                borderRadius: 2,
              },
            },
          },
          {
            type: "div",
            props: {
              style: {
                border: "2px solid #e8e6dc",
                background: "#faf9f5",
                borderRadius: "14px",
                display: "flex",
                justifyContent: "center",
                width: "84%",
                height: "76%",
              },
              children: {
                type: "div",
                props: {
                  style: {
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                    margin: "48px",
                    width: "90%",
                    height: "90%",
                  },
                  children: [
                    {
                      type: "p",
                      props: {
                        style: {
                          color: "#141413",
                          fontSize: 76,
                          fontWeight: 400,
                          lineHeight: 1.16,
                          maxHeight: "84%",
                          overflow: "hidden",
                        },
                        children: post.data.title,
                      },
                    },
                    {
                      type: "div",
                      props: {
                        style: {
                          display: "flex",
                          justifyContent: "space-between",
                          width: "100%",
                          marginBottom: "8px",
                          color: "#1B365D",
                          fontSize: 28,
                        },
                        children: [
                          {
                            type: "span",
                            props: {
                              children: [
                                "作者 ",
                                {
                                  type: "span",
                                  props: {
                                    style: { color: "transparent" },
                                    children: '"',
                                  },
                                },
                                {
                                  type: "span",
                                  props: {
                                    style: {
                                      overflow: "hidden",
                                      fontFamily: "Charter",
                                      fontWeight: 400,
                                    },
                                    children: post.data.author,
                                  },
                                },
                              ],
                            },
                          },
                          {
                            type: "span",
                            props: {
                              style: { overflow: "hidden", fontWeight: 400 },
                              children: SITE.title,
                            },
                          },
                        ],
                      },
                    },
                  ],
                },
              },
            },
          },
        ],
      },
    },
    {
      width: 1200,
      height: 630,
      embedFont: true,
      fonts: await loadLocalFonts(),
    }
  );
};
