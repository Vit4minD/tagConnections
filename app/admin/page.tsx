"use client";
import type React from "react";
import { useEffect, useState } from "react";
import {
  ChakraProvider,
  Box,
  Button,
  Input,
  Textarea,
  Heading,
  VStack,
  HStack,
  useToast,
  Text,
  Spinner,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Card,
  CardBody,
  CardHeader,
  CardFooter,
  FormLabel,
  Icon,
  Badge,
  Container,
} from "@chakra-ui/react";
import { collection, getDocs, setDoc, doc } from "firebase/firestore";
import { db } from "@/firebase/config";
import { FiLock, FiSettings, FiSave, FiUsers } from "react-icons/fi";

const ADMIN_PASSWORD = "correathegoat";

export default function AdminWordsPage() {
  const [password, setPassword] = useState("");
  const [unlocked, setUnlocked] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const toast = useToast();
  // Add state for raw input values
  const [rawInputs, setRawInputs] = useState<any>({});

  useEffect(() => {
    if (!unlocked) return;
    setLoading(true);
    fetch("/api/words")
      .then((res) => res.json())
      .then((json) => setData(json))
      .catch(() => setError("Failed to load data"))
      .finally(() => setLoading(false));
  }, [unlocked]);

  // When loading data, initialize rawInputs
  useEffect(() => {
    if (data) {
      setRawInputs({
        wordSet: "",
        yellow: "",
        green: "",
        blue: "",
        purple: "",
      });
    }
  }, [data]);

  async function updateAllDocumentsWithWords(wordSet: string[]) {
    const collectionRef = collection(db, "users");
    try {
      const querySnapshot = await getDocs(collectionRef);
      const promises = [];
      for (const docSnap of querySnapshot.docs) {
        const docRef = doc(collectionRef, docSnap.id);
        promises.push(
          setDoc(
            docRef,
            {
              allSubmissions: [],
              correctAnswersDisplay: [],
              lives: 4,
              visy: false,
              visg: false,
              visb: false,
              visp: false,
              correctAnswers: [],
              quantityWords: wordSet,
            },
            { merge: false }
          )
        );
      }
      await Promise.all(promises);
      console.log("All documents updated successfully");
    } catch (error) {
      console.error("Error updating documents: ", error);
      throw error;
    }
  }

  const handlePasswordSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === ADMIN_PASSWORD) {
      setUnlocked(true);
      setError("");
    } else {
      setError("Incorrect password");
    }
  };

  const handleChange = (key: string, value: any) => {
    setData((prev: any) => ({ ...prev, [key]: value }));
  };

  const handleArrayChange = (key: string, value: string) => {
    setRawInputs((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  // In handleSave, process rawInputs into arrays
  const handleSave = async () => {
    setSaving(true);
    try {
      const processedData = {
        ...data,
        wordSet: rawInputs.wordSet
          ? rawInputs.wordSet
              .split(/,\s*/)
              .map((w: string) => w.trim())
              .filter(Boolean)
          : [],
        yellow: rawInputs.yellow
          ? rawInputs.yellow
              .split(/,\s*/)
              .map((w: string) => w.trim())
              .filter(Boolean)
          : [],
        green: rawInputs.green
          ? rawInputs.green
              .split(/,\s*/)
              .map((w: string) => w.trim())
              .filter(Boolean)
          : [],
        blue: rawInputs.blue
          ? rawInputs.blue
              .split(/,\s*/)
              .map((w: string) => w.trim())
              .filter(Boolean)
          : [],
        purple: rawInputs.purple
          ? rawInputs.purple
              .split(/,\s*/)
              .map((w: string) => w.trim())
              .filter(Boolean)
          : [],
      };
      const res = await fetch("/api/words", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(processedData, null, 2),
      });
      if (res.ok) {
        const getRes = await fetch("/api/words");
        const json = await getRes.json();
        if (Array.isArray(json.wordSet)) {
          await updateAllDocumentsWithWords(json.wordSet);
        }
        toast({
          title: "Success!",
          description:
            "Game data has been saved, published, and all users updated.",
          status: "success",
          duration: 5000,
          isClosable: true,
        });
      } else {
        toast({
          title: "Error",
          description: "Failed to save game data. Please try again.",
          status: "error",
          duration: 5000,
          isClosable: true,
        });
      }
    } catch (e) {
      toast({
        title: "Error",
        description: "Failed to save game data. Please try again.",
        status: "error",
        duration: 5000,
        isClosable: true,
      });
    }
    setSaving(false);
  };

  if (!unlocked) {
    return (
      <ChakraProvider>
        <Box
          minH="100vh"
          bgGradient="linear(to-br, blue.50, cyan.50, sky.100)"
          display="flex"
          alignItems="center"
          justifyContent="center"
          p={6}
        >
          <Card
            w="full"
            maxW="md"
            boxShadow="2xl"
            borderRadius="2xl"
            border="1px"
            borderColor="blue.100"
            bg="white"
            backdropFilter="blur(10px)"
          >
            <CardHeader textAlign="center" pb={4}>
              <VStack spacing={4}>
                <Box
                  w={16}
                  h={16}
                  bg="blue.100"
                  borderRadius="full"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                >
                  <Icon as={FiLock} w={8} h={8} color="blue.600" />
                </Box>
                <VStack spacing={2}>
                  <Heading size="xl" color="blue.800" fontWeight="bold">
                    Admin Access
                  </Heading>
                </VStack>
              </VStack>
            </CardHeader>
            <CardBody pt={0}>
              <form onSubmit={handlePasswordSubmit}>
                <VStack spacing={5} align="stretch">
                  <Box>
                    <FormLabel
                      htmlFor="password"
                      color="blue.700"
                      fontWeight="semibold"
                      mb={2}
                    >
                      Password
                    </FormLabel>
                    <Input
                      id="password"
                      type="password"
                      value={password}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setPassword(e.target.value)
                      }
                      placeholder="Enter admin password"
                      borderColor="blue.200"
                      focusBorderColor="blue.400"
                      _hover={{ borderColor: "blue.300" }}
                      size="lg"
                      borderRadius="lg"
                    />
                  </Box>
                  {error && (
                    <Box
                      p={3}
                      bg="red.50"
                      border="1px"
                      borderColor="red.200"
                      borderRadius="lg"
                    >
                      <Text color="red.600" fontSize="sm" fontWeight="medium">
                        {error}
                      </Text>
                    </Box>
                  )}
                  <Button
                    type="submit"
                    colorScheme="blue"
                    size="lg"
                    borderRadius="lg"
                    fontWeight="semibold"
                    bgGradient="linear(to-r, blue.500, blue.600)"
                    _hover={{ bgGradient: "linear(to-r, blue.600, blue.700)" }}
                  >
                    Unlock Admin Panel
                  </Button>
                </VStack>
              </form>
            </CardBody>
          </Card>
        </Box>
      </ChakraProvider>
    );
  }

  if (loading)
    return (
      <ChakraProvider>
        <Box
          minH="100vh"
          bgGradient="linear(to-br, blue.50, cyan.50, sky.100)"
          display="flex"
          alignItems="center"
          justifyContent="center"
        >
          <VStack spacing={6}>
            <Spinner size="xl" color="blue.600" thickness="4px" />
            <VStack spacing={2}>
              <Text fontSize="xl" color="blue.700" fontWeight="semibold">
                Loading game data...
              </Text>
              <Text fontSize="md" color="blue.500">
                Please wait while we fetch your content
              </Text>
            </VStack>
          </VStack>
        </Box>
      </ChakraProvider>
    );

  if (!data) return null;

  return (
    <ChakraProvider>
      <Box
        minH="100vh"
        display="flex"
        alignItems="center"
        justifyContent="center"
        bgGradient="linear(to-br, blue.50, cyan.50, sky.100)"
      >
        <Container maxW="6xl">
          <Card
            boxShadow="2xl"
            borderRadius="2xl"
            border="1px"
            borderColor="blue.100"
            bg="white"
            backdropFilter="blur(10px)"
          >
            <CardHeader
              borderBottomWidth={1}
              borderColor="blue.100"
              bgGradient="linear(to-r, blue.50, cyan.50)"
              borderTopRadius="2xl"
              p={6}
            >
              <HStack justifyContent="space-between" align="start">
                <HStack spacing={4}>
                  <Box
                    w={12}
                    h={12}
                    bg="blue.100"
                    borderRadius="xl"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Icon as={FiSettings} w={6} h={6} color="blue.600" />
                  </Box>
                  <VStack alignItems="flex-start" spacing={1}>
                    <Heading size="xl" color="blue.800" fontWeight="bold">
                      TAG Connections Admin Panel
                    </Heading>
                  </VStack>
                </HStack>
              </HStack>
            </CardHeader>

            <CardBody p={8}>
              <Tabs variant="enclosed" colorScheme="blue" size="lg">
                <TabList
                  bg="blue.50"
                  borderRadius="xl"
                  p={1}
                  border="1px"
                  borderColor="blue.100"
                >
                  <Tab
                    borderRadius="lg"
                    fontWeight="semibold"
                    _selected={{
                      bg: "white",
                      color: "blue.700",
                      boxShadow: "sm",
                    }}
                  >
                    Word Set
                  </Tab>
                  <Tab
                    borderRadius="lg"
                    fontWeight="semibold"
                    _selected={{
                      bg: "yellow.100",
                      color: "yellow.800",
                      boxShadow: "sm",
                    }}
                  >
                    Yellow
                  </Tab>
                  <Tab
                    borderRadius="lg"
                    fontWeight="semibold"
                    _selected={{
                      bg: "green.100",
                      color: "green.800",
                      boxShadow: "sm",
                    }}
                  >
                    Green
                  </Tab>
                  <Tab
                    borderRadius="lg"
                    fontWeight="semibold"
                    _selected={{
                      bg: "blue.100",
                      color: "blue.800",
                      boxShadow: "sm",
                    }}
                  >
                    Blue
                  </Tab>
                  <Tab
                    borderRadius="lg"
                    fontWeight="semibold"
                    _selected={{
                      bg: "purple.100",
                      color: "purple.800",
                      boxShadow: "sm",
                    }}
                  >
                    Purple
                  </Tab>
                </TabList>

                <TabPanels mt={6}>
                  <TabPanel p={0}>
                    <VStack spacing={4} align="stretch">
                      <Box>
                        <FormLabel
                          htmlFor="wordSet"
                          color="blue.700"
                          fontWeight="semibold"
                          mb={3}
                        >
                          16 Word Set (enter comma separated & all caps)
                        </FormLabel>
                        {data.wordSet && (
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            Current:{" "}
                            {Array.isArray(data.wordSet)
                              ? data.wordSet.join(", ")
                              : data.wordSet}
                          </Text>
                        )}
                        <Textarea
                          id="wordSet"
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => handleArrayChange("wordSet", e.target.value)}
                          placeholder="Enter words separated by commas and a space (eg. 'abc, abc')"
                          minH="200px"
                          borderColor="blue.200"
                          focusBorderColor="blue.400"
                          _hover={{ borderColor: "blue.300" }}
                          borderRadius="lg"
                          fontSize="md"
                        />
                      </Box>
                    </VStack>
                  </TabPanel>

                  <TabPanel p={0}>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <FormLabel
                          htmlFor="yellowTitle"
                          color="yellow.700"
                          fontWeight="semibold"
                          mb={3}
                        >
                          Yellow Category Title
                        </FormLabel>
                        <Input
                          id="yellowTitle"
                          value={data.yellowTitle || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("yellowTitle", e.target.value)
                          }
                          placeholder="Enter yellow category title"
                          borderColor="yellow.200"
                          focusBorderColor="yellow.400"
                          _hover={{ borderColor: "yellow.300" }}
                          size="lg"
                          borderRadius="lg"
                        />
                      </Box>
                      <Box>
                        <FormLabel
                          htmlFor="yellow"
                          color="yellow.700"
                          fontWeight="semibold"
                          mb={3}
                        >
                          4 Yellow Words (enter comma separated & all caps)
                        </FormLabel>
                        {data.yellow && (
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            Current:{" "}
                            {Array.isArray(data.yellow)
                              ? data.yellow.join(", ")
                              : data.yellow}
                          </Text>
                        )}
                        <Textarea
                          id="yellow"
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => handleArrayChange("yellow", e.target.value)}
                          placeholder="Enter yellow words separated by commas and a space (eg. 'abc, abc')"
                          minH="120px"
                          borderColor="yellow.200"
                          focusBorderColor="yellow.400"
                          _hover={{ borderColor: "yellow.300" }}
                          borderRadius="lg"
                        />
                      </Box>
                    </VStack>
                  </TabPanel>

                  <TabPanel p={0}>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <FormLabel
                          htmlFor="greenTitle"
                          color="green.700"
                          fontWeight="semibold"
                          mb={3}
                        >
                          Green Category Title
                        </FormLabel>
                        <Input
                          id="greenTitle"
                          value={data.greenTitle || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("greenTitle", e.target.value)
                          }
                          placeholder="Enter green category title"
                          borderColor="green.200"
                          focusBorderColor="green.400"
                          _hover={{ borderColor: "green.300" }}
                          size="lg"
                          borderRadius="lg"
                        />
                      </Box>
                      <Box>
                        <FormLabel
                          htmlFor="green"
                          color="green.700"
                          fontWeight="semibold"
                          mb={3}
                        >
                          4 Green Words (enter comma separated & all caps)
                        </FormLabel>
                        {data.green && (
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            Current:{" "}
                            {Array.isArray(data.green)
                              ? data.green.join(", ")
                              : data.green}
                          </Text>
                        )}
                        <Textarea
                          id="green"
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => handleArrayChange("green", e.target.value)}
                          placeholder="Enter green words separated by commas and a space (eg. 'abc, abc')"
                          minH="120px"
                          borderColor="green.200"
                          focusBorderColor="green.400"
                          _hover={{ borderColor: "green.300" }}
                          borderRadius="lg"
                        />
                      </Box>
                    </VStack>
                  </TabPanel>

                  <TabPanel p={0}>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <FormLabel
                          htmlFor="blueTitle"
                          color="blue.700"
                          fontWeight="semibold"
                          mb={3}
                        >
                          Blue Category Title
                        </FormLabel>
                        <Input
                          id="blueTitle"
                          value={data.blueTitle || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("blueTitle", e.target.value)
                          }
                          placeholder="Enter blue category title"
                          borderColor="blue.200"
                          focusBorderColor="blue.400"
                          _hover={{ borderColor: "blue.300" }}
                          size="lg"
                          borderRadius="lg"
                        />
                      </Box>
                      <Box>
                        <FormLabel
                          htmlFor="blue"
                          color="blue.700"
                          fontWeight="semibold"
                          mb={3}
                        >
                          4 Blue Words (enter comma separated & all caps)
                        </FormLabel>
                        {data.blue && (
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            Current:{" "}
                            {Array.isArray(data.blue)
                              ? data.blue.join(", ")
                              : data.blue}
                          </Text>
                        )}
                        <Textarea
                          id="blue"
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => handleArrayChange("blue", e.target.value)}
                          placeholder="Enter blue words separated by commas and a space (eg. 'abc, abc')"
                          minH="120px"
                          borderColor="blue.200"
                          focusBorderColor="blue.400"
                          _hover={{ borderColor: "blue.300" }}
                          borderRadius="lg"
                        />
                      </Box>
                    </VStack>
                  </TabPanel>

                  <TabPanel p={0}>
                    <VStack spacing={6} align="stretch">
                      <Box>
                        <FormLabel
                          htmlFor="purpleTitle"
                          color="purple.700"
                          fontWeight="semibold"
                          mb={3}
                        >
                          Purple Category Title
                        </FormLabel>
                        <Input
                          id="purpleTitle"
                          value={data.purpleTitle || ""}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                            handleChange("purpleTitle", e.target.value)
                          }
                          placeholder="Enter purple category title"
                          borderColor="purple.200"
                          focusBorderColor="purple.400"
                          _hover={{ borderColor: "purple.300" }}
                          size="lg"
                          borderRadius="lg"
                        />
                      </Box>
                      <Box>
                        <FormLabel
                          htmlFor="purple"
                          color="purple.700"
                          fontWeight="semibold"
                          mb={3}
                        >
                          4 Purple Words (enter comma separated & all caps)
                        </FormLabel>
                        {data.purple && (
                          <Text fontSize="sm" color="gray.500" mb={2}>
                            Current:{" "}
                            {Array.isArray(data.purple)
                              ? data.purple.join(", ")
                              : data.purple}
                          </Text>
                        )}
                        <Textarea
                          id="purple"
                          onChange={(
                            e: React.ChangeEvent<HTMLTextAreaElement>
                          ) => handleArrayChange("purple", e.target.value)}
                          placeholder="Enter purple words separated by commas and a space (eg. 'abc, abc')"
                          minH="120px"
                          borderColor="purple.200"
                          focusBorderColor="purple.400"
                          _hover={{ borderColor: "purple.300" }}
                          borderRadius="lg"
                        />
                      </Box>
                    </VStack>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </CardBody>

            <CardFooter
              borderTopWidth={1}
              borderColor="blue.100"
              bgGradient="linear(to-r, blue.50, cyan.50)"
              borderBottomRadius="2xl"
              px={8}
              py={6}
              display="flex"
              justifyContent="space-between"
              alignItems="center"
            >
              <HStack spacing={3}>
                <Icon as={FiUsers} color="blue.600" w={5} h={5} />
                <Badge
                  colorScheme="blue"
                  variant="subtle"
                  px={3}
                  py={1}
                  borderRadius="full"
                  fontWeight="semibold"
                >
                  Admin Mode Active
                </Badge>
              </HStack>
              <Button
                onClick={handleSave}
                isLoading={saving}
                loadingText="Saving..."
                colorScheme="blue"
                size="lg"
                borderRadius="lg"
                fontWeight="semibold"
                bgGradient="linear(to-r, blue.500, blue.600)"
                _hover={{ bgGradient: "linear(to-r, blue.600, blue.700)" }}
                leftIcon={<Icon as={FiSave} />}
              >
                Save & Publish
              </Button>
            </CardFooter>
          </Card>
        </Container>
      </Box>
    </ChakraProvider>
  );
}
