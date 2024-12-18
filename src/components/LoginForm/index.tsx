"use client";
import React, { useState, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { LoginPayload, LoginResponse } from "@/types/auth";
import Link from "next/link";
import { MD5 } from "crypto-js";
import { Visibility, VisibilityOff, Email, CheckCircle, CircleOutlined } from "@mui/icons-material";
import {
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  TextField,
  Typography,
} from "@mui/material";


export default function LoginForm() {
  const mc2ApiUrl = process.env.NEXT_PUBLIC_MC2_API_URL;
  const searchParams = useSearchParams();
  const router = useRouter();

  const [formData, setFormData] = useState<LoginPayload>({
    username: "",
    password: "",
    // keepMeLoggedIn: false,
  });
  const [redirectUrl, setRedirectUrl] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const url = searchParams.get("redirect_url");
    if (url) {
      try {
        const parsedUrl = new URL(url);
        setRedirectUrl(parsedUrl.toString());
      } catch (e) {
        console.error("Invalid redirect URL provided:", url);
      }
    }
  }, [searchParams]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const hashedPassword = MD5(formData.password).toString();
      const payload = {...formData, password: hashedPassword};
      const response = await fetch(`${mc2ApiUrl}/firebase-authen`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });
      console.log(payload)
      if (!response.ok) {
        const errorResponse = await response.json();
        console.log(errorResponse)
        setError(errorResponse.data.message || "Login failed. Please try again.");
        return;
      }

      const data: LoginResponse = await response.json();       
      if (redirectUrl) {
        const callbackUrl = new URL(redirectUrl);
        callbackUrl.searchParams.append("token", data.data.idToken); // Append token to redirect URL
        router.push(callbackUrl.toString());
      } else {
        // Default behavior if no redirect_url is provided
        router.push("/post-login");
      }
    } catch (error) {
      if (error instanceof Error) {
        setError(error.message);
      } else {
        setError("An unexpected error occurred");
      }
    } finally {
      setLoading(false);
    }
  };

  const customStyle = {
    "& .MuiInputBase-input": {
      color: "#000000",
    },

    "& .MuiInput-underline:before": {
      borderBottomColor: "#CCCCCC",
    },
    "& .MuiInput-underline:hover:not(.Mui-disabled):before": {
      borderBottomColor: "#DDDDDD",
    },
    "& .MuiOutlinedInput-root": {
      "& fieldset": {
        borderColor: "#FFF",
        boxShadow: "0px 5px 15px 0px #CCC",
        borderRadius: "5px",
      },
      "&:hover fieldset": {
        borderColor: "#DDDDDD",
      },
      "& .MuiButton-contained": {
        backgroundColor: "#FFC700",
      }
    },
  };
  return (
    <>
      <Box
        component="form"
        onSubmit={handleSubmit}
        sx={{
          width: "100%",
          maxWidth: "400px",
          mx: "auto",
          p: 3,
          bgcolor: "white",
        }}
      >
        <Typography variant="h5" align="center" gutterBottom sx={{ fontWeight: "bold" }}>
          SIGN IN
        </Typography>
        {error && (
          <Typography variant="body2" color="error" align="center" gutterBottom>
            {error}
          </Typography>
        )}
        <FormControl fullWidth margin="normal">
          <TextField
            id="username"
            name="username"
            label="Enter your dental council code"
            type="text"
            value={formData.username}
            onChange={handleChange}
            required
            sx={customStyle}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <Email />
                  </InputAdornment>
                ),
              },
            }}
          />
        </FormControl>
        <FormControl fullWidth margin="normal">
          <TextField
            id="password"
            name="password"
            label="Password"
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={handleChange}
            required
            sx={customStyle}
            slotProps={{
              input: {
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setShowPassword(!showPassword)} edge="end">
                      {showPassword ? (
                        <Visibility className="text-[#FFC700]" />
                      ) : (
                        <VisibilityOff className="text-[#FFC700]" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
        </FormControl>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            my: 2,
          }}
        >
          {/* <FormControlLabel
            control={
              <Checkbox
                icon={<CircleOutlined />}
                checkedIcon={<CheckCircle />}
                name="keepMeLoggedIn"
                checked={formData.keepMeLoggedIn}
                onChange={handleChange}
              />
            }
            label="Keep me logged in"
            slotProps={{ typography: { variant: "body2" } }}
          /> */}
          <Typography variant="body2">
            <Link href="/auth/forgot-password" style={{ color: "#FFC700" }}>
              Forgot password?
            </Link>
          </Typography>
        </Box>
        <Button type="submit" variant="contained" sx={{bgcolor:"#FFC700", fontWeight:"Bold", borderRadius:2, p:2}} fullWidth disabled={loading}>
          {loading ? "Signing In..." : "Sign In"}
        </Button>
        
          <Typography align="center" gutterBottom className="p-4">
            Don’t have an account? <Link href="/auth/register" className="text-[#00809C]">Register</Link>
          </Typography>
        
      </Box>
    </>
  );
}
