import { Box, Flex } from "@chakra-ui/layout";
import SearchOptimization from "./SearchOptimization";
import Header from "../Header";
import Footer from "../Footer";

const Layout = ({ children }: React.PropsWithChildren<{}>) => {
  return (
    <Flex className="flex-col items-center justify-between w-full h-full min-h-screen">
      <SearchOptimization />
      <Header />
      <Box className="w-full">{children}</Box>
      <Footer />
    </Flex>
  );
};

export default Layout;
