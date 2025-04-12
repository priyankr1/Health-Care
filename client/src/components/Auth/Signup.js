import { Box, Button, Input, useToast,useBreakpointValue, InputGroup, InputRightElement } from "@chakra-ui/react";
import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { signup } from "../../Api/Auth";
import axios from "axios";
import { useAuthState } from "../../context/AuthProvider";
import Sidebar from "./Sidebar";
import { useGoogleLogin } from "@react-oauth/google";

const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [btnState, setBtnState] = useState(1);
  const [otp, setOtp] = useState(null);
  const [loading, setLoading] = useState(false);
  const { setUser } = useAuthState();
    const [showPass, setShowPass] = useState(false);
  
  const toast = useToast();
  const navigate = useNavigate();
  window.onpopstate = () => {
    if (btnState > 1) {
      setBtnState(btnState - 1);
    } else {
      navigate("/");
    }
  };
  
  const responseGoogle = async (authResult) => {
    try {
      if (authResult?.code) {
        const result = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/google-auth?code=${authResult?.code}`
        );
        if(result.data.success){
          const obj = { ...result?.data?.user, jwt: result?.data?.token };
          const user = JSON.stringify(obj);
          localStorage.setItem("userInfo", user);
          setUser(obj);
          toast({
            title: "Login successfully",
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          navigate("/");
        }
      }
    } catch (err) {
      console.log(err);
      alert(err.message);
    }
  };
  const googleLoginHandle = useGoogleLogin({
    onSuccess: responseGoogle,
    onError: responseGoogle,
    flow: "auth-code",
  });
const emailPlaceholderText =
    useBreakpointValue({
      lg: "Enter your email",
      md: "Enter your email",
      sm: "Email",
    }) || "Email";
  const passwordPlaceholderText =
    useBreakpointValue({
      lg: "Enter your password",
      md: "Enter your password",
      sm: "Password",
    }) || "Password";
    const namePlaceholderText =
        useBreakpointValue({
          lg: "Enter your name",
          md: "Enter your name",
          sm: "Name",
        }) || "Name";
      const otpPlaceholderText =
        useBreakpointValue({
          lg: "Enter your otp",
          md: "Enter your otp",
          sm: "Enter OTP",
        }) || "Enter OTP";

  const handleSubmit = async (e) => {
    // FOR GET OTP
    if (e.target.innerText === "Next") {
      setLoading(true);

      try {
        const { data } = await axios.get(
          `${process.env.REACT_APP_API_URL}/api/v1/user/otp-verification/?email=${email}`
        );
        if (data.success) {
          toast({
            title: data.message,
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setBtnState(2);
        } else {
          toast({
            title: data.message || "An error occurred",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setEmail("");
        }
      } catch (err) {
        console.log(err);
        toast({
          title: err.response.data.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
      setLoading(false);

    }
    // TO VERIFY OTP
    if (e.target.innerText === "Verify OTP") {
      setLoading(true);

      try {
        const { data } = await axios.post(
          `${process.env.REACT_APP_API_URL}/api/v1/user/otp-verification`,
          { email, otp }
        );
        if (data.success) {
          toast({
            title: data.message || "An error occurred",
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          setBtnState(3);
        } else {
          toast({
            title: data.message || "An error occurred",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
        }
      } catch (err) {
        toast({
          title: err.response.data.message || "An error occurred",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
      setLoading(false);

    }
    // when user in at SIGN UP STEP
    if (e.target.innerText === "Sign up") {
      setLoading(true);

      try {
        const data = await signup({ name, email, password });
        if (!data.success) {
          toast({
            title: data.message || "An error occurred",
            status: "error",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
        } else {
          const obj = { ...data.user, jwt: data.token };
          setUser(obj);
          const user = JSON.stringify(obj);
          localStorage.setItem("userInfo", user);
          toast({
            title: "Signup successful",
            status: "success",
            isClosable: true,
            duration: 5000,
            position: "top",
          });
          navigate("/");
        }
      } catch (error) {
        toast({
          title: error.response.data.message,
          description: "Please try again later.",
          status: "error",
          isClosable: true,
          duration: 5000,
          position: "top",
        });
      }
      setLoading(false);

    }
  };

  return (
    <Box
      h={"100vh"}
      w={"100vw"}
      background={"#ffffff"}
      display={"flex"}
      alignItems={"center"}
      justifyContent={"center"}
      className="loginBox"
    >
      <Box
        boxSizing="border-box"
        w={{sm:"100%",md:"50%",lg:"30%"}}
        display={"flex"}
        flexDir={"column"}
        className="loginModal"
        alignItems={"start"}
        justifyContent={"start"}
        gap={"15px"}
        bg={"#ffffff"}
        minW={"50px"}
        borderRadius={"10px"}
        paddingLeft={"40px"}
      >
        <h1
          className="logo"
          style={{
            cursor: "pointer",
            marginBottom: "20px",
            fontSize: "clamp(30px, 5vw, 30px)",
          }}
          onClick={() => {
            navigate("/");
          }}
        >
          <span className="logo-span">H</span>ealth
          <span className="logo-span">T</span>alk
        </h1>

         <h2
                  style={{
                    fontSize: "clamp(20px,3vw,30px)",
                    letterSpacing: "1px",
                    fontWeight: "400",
                  }}
                >
                  Create your account
                </h2>
                <NavLink
                  to={"/login"}
                  style={{
                    fontSize: "clamp(16px,1.5vw,20px)",
                    fontWeight: "500",
                    marginBottom: "20px",
                    marginTop: "-20px",
                  }}
                >
                   Have an Account? <span style={{ color: "blue" }}>Log in</span>
                </NavLink>
                <Button
                  p={"10px"}
                  borderRadius={"10px"}
                  border={"1px solid black"}
                  width={"clamp(150px,90%,1000px)"}
                  onClick={googleLoginHandle}
                  fontSize={"clamp(15px,3vw,20px)"}
                  bg={"white"}
                >
                  {" "}
                  <img
                    src="https://img.icons8.com/?size=100&id=17949&format=png&color=000000"
                    alt=""
                    style={{ width: "25px", marginRight: "5px" }}
                  />{" "}
                  Google
                </Button>
                
                <h1 style={{ alignSelf: "center", marginRight: "40px" }}>Or</h1>
        <Input
          type="email"
          placeholder={emailPlaceholderText}
          p={"10px"}
          borderRadius={"10px"}
          border={"1px solid black"}
          outline={"none"}
          width={"clamp(150px,90%,1000px)"}
          minW={"80px"}
          onChange={(e) => setEmail(e.target.value)}
          value={email}
          fontSize={"clamp(15px,3vw,20px)"}
          bg={"white"}
          disabled={btnState > 1}
          _hover={{
            border: "1px solid black",
          }}
          _focus={{
            border: "1px solid black !important",
            boxShadow: "none !important",
          }}
          _disabled={{
            backgroundColor: "white", // Light red background
            border: "1px solid black", // Dashed border
            borderRadius: "10px",
            cursor: "not-allowed", // Not allowed cursor
            opacity: 1, // Full opacity
          }}
        />

        {btnState === 2 && (
          <Input
            type="number"
            placeholder={otpPlaceholderText}
            onChange={(e) => setOtp(e.target.value)}
            borderRadius={"10px"}
            border={"1px solid black"}
            outline={"none"}
            width={"clamp(150px,90%,1000px)"}
            minW={"80px"}
            fontSize={"clamp(15px,3vw,20px)"}
            bg={"white"}
            value={otp}
            _hover={{
              border: "1px solid black",
            }}
            _focus={{
              border: "1px solid black !important",
              boxShadow: "none !important",
            }}
            css={{
              "&::-webkit-inner-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&::-webkit-outer-spin-button": {
                WebkitAppearance: "none",
                margin: 0,
              },
              "&": { MozAppearance: "textfield" }, // For Firefox
            }}
          />
        )}
        {btnState === 3 && (
          <>
            <Input
              type="text"
              placeholder={namePlaceholderText}
              p="10px"
              borderRadius="10px"
              border={"1px solid black"}
              outline="none"
              bg="white"
              width={"clamp(150px,90%,1000px)"}
              onChange={(e) => setName(e.target.value)}
              value={name}
              minW="80px"
              fontSize="20px"
              _hover={{
                border: "1px solid black",
              }}
              _focus={{
                border: "1px solid black !important",
                boxShadow: "none !important",
              }}
            />
           <InputGroup width={"clamp(150px,90%,1000px)"}>
          <Input
            type={!showPass ? "password" : "text"}
            placeholder={passwordPlaceholderText}
            p={"10px"}
            borderRadius={"10px"}
            border={"1px solid black"}
            outline={"none"}
            width={"100%"}
            maxLength={28}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fontSize={"clamp(15px,3vw,20px)"}
            bg={"white"}
            _hover={{
              border: "1px solid black",
            }}
            _focus={{
              border: "1px solid black !important",
              boxShadow: "none !important",
            }}
          />
          <InputRightElement width="4.5rem">
            <button
              style={{
                background: "white",
                border: "none",
                cursor: "pointer",
                fontSize: "14px",
                color: "blue",
                zIndex:3,
                
              }}
              onClick={() => setShowPass(!showPass)}
            >
              {!showPass ? "Show" : "Hide"}
            </button>
          </InputRightElement>
        </InputGroup>
          </>
        )}

        <button
          className="authBtn"
          onClick={!loading?handleSubmit:undefined}
          disabled={loading}
          style={{
            alignSelf: "flex-start",
            minWidth: "80px",
            marginTop: "30px",
            background:loading&&"gray",
            borderColor:loading&&"gray",
            cursor:loading&&"not-allowed"

          }}
        >
          {btnState === 1 && (!loading?"Next":"Wait...")}
          {btnState === 2 && (!loading?"Verify OTP":"Verifying...")}
          {btnState === 3 && (!loading?"Sign up":"Signing...")}
        </button>
      </Box>
      <Sidebar />
    </Box>
  );
};

export default Signup;
