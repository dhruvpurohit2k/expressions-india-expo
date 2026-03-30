import {
  View,
  Text,
  Image,
  ScrollView,
  Dimensions,
  Pressable,
} from "react-native";
import { styleFactory } from "../styleFactory";
import { theme } from "../theme";
import events from "@/data/events/events";
import Animated, {
  Easing,
  FadeInLeft,
  SlideInDown,
  SlideInLeft,
  useAnimatedScrollHandler,
  useSharedValue,
} from "react-native-reanimated";
import AnimatedDots from "./AnimatedDots";
import { useImageContext } from "../context/imageContext";
import { Link } from "expo-router";
import UpcomingEvents from "./UpcomingEvents";
import PastEvents from "./PastEvents";
import { useIsFocused } from "@react-navigation/native";

const globalStyle = styleFactory();
const screenWidth = Dimensions.get("window").width;
export default function Events() {
  // const isFocused = useIsFocused();
  // if (!isFocused) return null;
  return (
    <Animated.View
      style={[globalStyle.screen]}
      // entering={FadeInLeft.duration(500).delay(500)}
    >
      {/*<Text style={[globalStyle.sectionHeading]}>EVENTS</Text>*/}
      <Animated.View entering={SlideInLeft.duration(700).delay(50)}>
        <UpcomingEvents />
      </Animated.View>
      <Animated.View entering={SlideInDown.duration(700).delay(200)}>
        <PastEvents />
      </Animated.View>
      {/*<Text
        style={[
          globalStyle.text,
          {
            fontSize: 24,
            fontFamily: theme.fontBold,
            textAlign: "left",
          },
        ]}
      >
        Monthly Calendar of Events, Achievements and Landmarks
      </Text>*/}
      {/*{events.map((event, index) => {
        return <Event key={index} event={event} />;
      })}*/}
    </Animated.View>
  );
}

// function Event({ event }: { event: { name: string; images: any[] } }) {
//   const scrollX = useSharedValue<number>(0);
//   const { setImage } = useImageContext();
//   return (
//     <View
//       style={{
//         padding: 10,
//         paddingHorizontal: 15,
//         elevation: 5,
//         backgroundColor: theme.backgroundColor,
//         borderRadius: 10,
//         marginVertical: 20,
//         marginHorizontal: 10,
//         alignItems: "center",
//       }}
//     >
//       <Text style={globalStyle.text}>{event.name}</Text>
//       <Animated.ScrollView
//         horizontal={true}
//         pagingEnabled={true}
//         decelerationRate={"fast"}
//         showsHorizontalScrollIndicator={false}
//         onScroll={useAnimatedScrollHandler((event) => {
//           scrollX.value = event.contentOffset.x;
//         })}
//         style={{
//           // marginHorizontal: 10,
//           borderRadius: 10,
//         }}
//       >
//         {event.images.map((image, i) => (
//           <View
//             key={i}
//             style={{
//               elevation: 2,
//               padding: 10,
//               backgroundColor: theme.backgroundColorLight,
//               borderRadius: 10,
//               marginHorizontal: 10,
//               marginVertical: 10,
//             }}
//           >
//             <Link href="/modal" asChild>
//               <Pressable onPress={() => setImage(image)}>
//                 <Image
//                   source={image}
//                   style={{
//                     width: screenWidth - 110,
//                     height: 300,
//                   }}
//                   resizeMode="contain"
//                 />
//               </Pressable>
//             </Link>
//           </View>
//         ))}
//       </Animated.ScrollView>
//       <AnimatedDots scrollX={scrollX} count={event.images.length} />
//     </View>
//   );
// }
