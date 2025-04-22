import React, { useState, useRef, useEffect } from "react";
import { Box } from "@chakra-ui/react";

const InfoBox = ({ info }) => {
  const [edit, setEdit] = useState(false);
  const [expand, setExpand] = useState(false);
  const [localValue, setLocalValue] = useState(info.value); // <-- local state
  const contentRef = useRef(null);

  useEffect(() => {
    if (edit && contentRef.current) {
      const element = contentRef.current;
      element.focus();

      const range = document.createRange();
      const selection = window.getSelection();
      range.selectNodeContents(element);
      range.collapse(false);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  }, [edit]);

  useEffect(() => {
    // Keep local value in sync with prop changes
    setLocalValue(info.value);
  }, [info.value]);

  const handleInput = (e) => {
    const newValue = e.target.textContent;
    setLocalValue(newValue); // update locally
    info?.handleFunction(newValue); // send to parent
  };

  const handleToggleEdit = () => {
    if (edit) {
      // if cancelling, reset local value
      setLocalValue(info.value);
    } else {
      // if adding, clear value
      if (!info.color) {
        setLocalValue("");
        info?.handleFunction("");
      }
    }
    setEdit(!edit);
  };

  return (
    <Box
      w={"100%"}
      borderBottom={"1px solid gray"}
      display={"flex"}
      justifyContent={"start"}
      gap={"20px"}
      pb={"10px"}
      p={"5px 5px 10px 5px"}
    >
      <h1 style={{ fontSize: "17px", width: "25%" }}>{info?.title}</h1>
      <Box w={"64%"} display={"flex"} alignItems={"center"} justifyContent={"start"}>
        <h1
          ref={contentRef}
          style={{
            fontSize: "18px",
            color: info?.color ? "black" : "gray",
            outline: "none",
          }}
          contentEditable={edit}
          suppressContentEditableWarning={true}
          onInput={handleInput}
        >
          {!edit ? (
            info.title === "Description" ? (
              info.value.length > 80 ? (
                expand ? info.value : info.value.slice(0, 80) + "..."
              ) : (
                info.value
              )
            ) : (
              info.value
            )
          ) : (
            localValue
          )}
          {info.title === "Description" && info.value.length > 80 && !edit && (
            <span
              style={{ color: "blue", cursor: "pointer", marginLeft: "5px" }}
              onClick={() => setExpand(!expand)}
            >
              read {expand ? "less" : "more"}
            </span>
          )}
        </h1>
      </Box>
      {info.title !== "Email" && (
        <button style={{ color: "blue" }} onClick={handleToggleEdit}>
          {!edit ? (info?.color ? "Edit" : "Add") : "Cancel"}
        </button>
      )}
    </Box>
  );
};


export default InfoBox;