import { useToast, UseToastOptions } from "@chakra-ui/react";

export const useSuccessToast = () => {
  const toast = useToast();

  return (options: Omit<UseToastOptions, "status"> & { title: string }) => {
    toast({
        status: "success",
        duration: 4000,
        isClosable: true,
        position: "top-right",
        ...options,
    });
  };
};

export const useErrorToast = () => {
  const toast = useToast();

  return (options: Omit<UseToastOptions, "status"> & { title?: string }) => {
    toast({
        title: options.title ?? "Error",
        status: "error",
        duration: 4000,
        isClosable: true,
        position: "top-right",
        ...options,
    });
  };
};
