import axios from "axios";
import React, { useEffect, useState, useCallback } from "react";
import { useAuthState } from "../../../context/AuthProvider";
import { Box } from "@chakra-ui/react";
import DocReviewCard from "./DocReviewCard";
const DoctorReviews = () => {
  const { user } = useAuthState();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(false);
  const fetchReviews = useCallback(async () => {
    const token = user?.jwt;
    if (!token) return;
    setLoading(true);
    const { data } = await axios.get(
      `${process.env.REACT_APP_API_URL}/api/v1/review`,
      {
        headers: {
          "Content-Type": "multipart/form-data",
          authorization: `Bearer ${token}`,
        },
      }
    );
    if (data.success) {
      setReviews(data?.reviews);
    }
    setLoading(false);
  }, [user]);
  useEffect(() => {
    fetchReviews();
  }, [fetchReviews]);
  return (
    <Box
    display={"flex"}
    flexDir={"column"}
    alignItems={"start"}
    justifyContent={"start"}
    w={"clamp(320px,90%,1000px)"}
    minH={"85vh"}
    maxH={"85vh"}
    height={'auto'}
          p={"2px 20px"}
          pt={'10px'}
          pb={'1vh'}
    bg={"white"}
    borderRadius={"10px"}
    boxShadow={"1px 1px 10px 4px #686d77"}
    sx={{
      "@media(max-width:500px)":{
        minHeight:"63vh",
        maxHeight:"63vh"
      },
    }}
    >
       {reviews.length > 0 && (
        <h1 className="page-head">Your All Reviews</h1>
      )}
      {!loading ? (
        reviews.length > 0 ? (
          reviews.map((review) => (
            <DocReviewCard
              review={review}
              setReviews={setReviews}
              reviews={reviews}
            />
          ))
        ) : (
          <h1 className="no-item-text">No reviews</h1>
        )
      ) : (
        <h1 className="no-item-text">Loading...</h1>
      )}
    </Box>
  );
};

export default DoctorReviews;
