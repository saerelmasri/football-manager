/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { postWithBody } from "@/utils/apis/endpoints";

export default function Auth() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const [isLogin, setIsLogin] = useState<boolean>(true);

  const [isAlertOpen, setIsAlertOpen] = useState<boolean>(false);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [modalContent, setModalContent] = useState<{
    title: string;
    message: string;
  }>({ title: "", message: "" });

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email === "" || password === "") {
      setIsAlertOpen(true);
      return;
    }

    try {
      const endpoint = isLogin ? "/auth/login" : "/auth/register";
      const response = await postWithBody(endpoint, {
        email: email,
        password: password,
      });

      if (response.token) {
        localStorage.setItem("token", response.token);
      } else {
        throw new Error("Token not received.");
      }
      
      if (isLogin) {
        setModalContent({
          title: "Login Successful",
          message: "Welcome back to your team management dashboard!",
        });
        setIsModalOpen(true);
        setTimeout(() => router.push("/team"), 2000);
      } else {
        setModalContent({
          title: "Registration Successful",
          message:
            "Welcome! Your account has been created and your team is being set up.",
        });
        setIsModalOpen(true);
        setTimeout(() => router.push("/team-creation"), 2000);
      }
    } catch (error: any) {
      console.log("Error:", error.response.data.message);

      setModalContent({
        title: "Error",
        message: `${error.response.data.message}`,
      });
      setIsModalOpen(true);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <Card className="w-[350px]">
        <CardHeader>
          <CardTitle>{isLogin ? "Login" : "Register"}</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>
            <Button type="submit" className="w-full">
              {isLogin ? "Login" : "Register"}
            </Button>
          </form>
          <p
            className="mt-4 text-center text-sm text-gray-600 cursor-pointer"
            onClick={() => setIsLogin(!isLogin)}
          >
            {isLogin
              ? "Don't have an account? Register here."
              : "Already have an account? Login here."}
          </p>
        </CardContent>
      </Card>

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{modalContent.title}</DialogTitle>
          </DialogHeader>
          <p>{modalContent.message}</p>
          <DialogFooter>
            <Button onClick={() => setIsModalOpen(false)}>Close</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <AlertDialog open={isAlertOpen} onOpenChange={setIsAlertOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Missing Fields</AlertDialogTitle>
            <AlertDialogDescription>
              Please fill in both email and password to continue.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setIsAlertOpen(false)}>
              OK
            </AlertDialogCancel>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </main>
  );
}
