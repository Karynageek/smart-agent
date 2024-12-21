import React, { FC, useState } from "react";
import {
  Input,
  Button,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Text,
  Box,
  Select,
} from "@chakra-ui/react";
import { FaCheckCircle, FaTimesCircle } from "react-icons/fa";
import styles from "./index.module.css";
import {
  HotelFinderMessagePayload,
} from "@/services/types";

type HotelFinderFormProps = {
  onSubmit: (payload: HotelFinderMessagePayload) => void;
};

export const HotelFinderForm: FC<HotelFinderFormProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<HotelFinderMessagePayload>({
    checkIn: "",
    checkOut: "",
    city: "",
    adults: 1,
    children: 0,
    rooms: 1,
    currency: "USD",
    priceRange: "",
    rating: "",
  });

  const [feedbackMessage, setFeedbackMessage] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = () => {
    try {
      onSubmit(formData);
      setIsSuccess(true);
      setFeedbackMessage("Hotel search initiated successfully!");
    } catch (error) {
      console.error("Error submitting form:", error);
      setIsSuccess(false);
      setFeedbackMessage("Failed to initiate hotel search. Please try again.");
    } finally {
      onOpen();
    }
  };

  return (
    <>
      <Flex direction="column" align="center" className={styles.formContainer}>
        <Input
          placeholder="City"
          name="city"
          value={formData.city}
          onChange={handleChange}
          mb={2}
        />
        <Input
          placeholder="Check-in Date (YYYY-MM-DD)"
          name="checkIn"
          value={formData.checkIn}
          onChange={handleChange}
          mb={2}
        />
        <Input
          placeholder="Check-out Date (YYYY-MM-DD)"
          name="checkOut"
          value={formData.checkOut}
          onChange={handleChange}
          mb={2}
        />
        <Flex gap={2} mb={2}>
          <Input
            placeholder="Adults"
            name="adults"
            type="number"
            value={formData.adults}
            onChange={handleChange}
          />
          <Input
            placeholder="Children"
            name="children"
            type="number"
            value={formData.children}
            onChange={handleChange}
          />
          <Input
            placeholder="Rooms"
            name="rooms"
            type="number"
            value={formData.rooms}
            onChange={handleChange}
          />
        </Flex>
        <Select
          placeholder="Currency"
          name="currency"
          value={formData.currency}
          onChange={handleChange}
          mb={2}
        >
          <option value="USD">USD</option>
          <option value="EUR">EUR</option>
          <option value="GBP">GBP</option>
        </Select>
        <Input
          placeholder="Price Range (e.g., 100-200)"
          name="priceRange"
          value={formData.priceRange}
          onChange={handleChange}
          mb={2}
        />
        <Input
          placeholder="Rating (e.g., 3, 4, 5)"
          name="rating"
          value={formData.rating}
          onChange={handleChange}
          mb={2}
        />
        <Button colorScheme="blue" onClick={handleSubmit} className={styles.submitButton}>
          Search Hotels
        </Button>
      </Flex>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{isSuccess ? "Success" : "Error"}</ModalHeader>
          <ModalBody>
            <Flex align="center">
              {isSuccess ? (
                <FaCheckCircle color="green" size={24} />
              ) : (
                <FaTimesCircle color="red" size={24} />
              )}
              <Text ml={3}>{feedbackMessage}</Text>
            </Flex>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={isSuccess ? "green" : "red"}
              mr={3}
              onClick={onClose}
            >
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};
