import { SafeAreaView } from "react-native-safe-area-context";
import { Text, View, ScrollView, Pressable } from "react-native";
import { theme } from "@/src/theme";
import * as Linking from "expo-linking";
import { Link } from "expo-router";
import Button from "@/src/components/ui/button";
import { Mail, Phone, MapPin, ExternalLink } from "lucide-react-native";
import Animated, { FadeInDown } from "react-native-reanimated";
import { styleFactory } from "@/src/styleFactory";

const lightRed = "hsl(4, 65%, 50%)";

function SectionCard({
  children,
  delay = 0,
}: {
  children: React.ReactNode;
  delay?: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(delay)}
      style={{
        backgroundColor: theme.backgroundColorLight,
        borderRadius: 16,
        padding: 18,
        marginBottom: 12,
        // shadowColor: "#000",
        // shadowOffset: { width: 0, height: 1 },
        // shadowOpacity: 0.06,
        // shadowRadius: 6,
        elevation: 2,
      }}
    >
      {children}
    </Animated.View>
  );
}

function SectionLabel({ children }: { children: string }) {
  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 12,
      }}
    >
      <View
        style={{
          width: 3,
          height: 18,
          backgroundColor: lightRed,
          borderRadius: 2,
        }}
      />
      <Text
        style={{
          fontSize: 13,
          fontFamily: theme.fontBold,
          color: lightRed,
          textTransform: "uppercase",
          letterSpacing: 0.8,
        }}
      >
        {children}
      </Text>
    </View>
  );
}

function ContactRow({
  icon,
  text,
  onPress,
}: {
  icon: React.ReactNode;
  text: string;
  onPress?: () => void;
}) {
  const inner = (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingVertical: 4,
      }}
    >
      <View style={{ width: 20, alignItems: "center" }}>{icon}</View>
      <Text
        style={{
          fontFamily: theme.font,
          fontSize: 14,
          color: onPress ? lightRed : theme.text,
          flex: 1,
          textDecorationLine: onPress ? "underline" : "none",
        }}
      >
        {text}
      </Text>
    </View>
  );

  if (onPress) {
    return <Pressable onPress={onPress}>{inner}</Pressable>;
  }
  return inner;
}

function SocialButton({
  label,
  url,
  color,
  delay,
}: {
  label: string;
  url: string;
  color: string;
  delay: number;
}) {
  return (
    <Animated.View
      entering={FadeInDown.duration(400).delay(delay)}
      style={{ flex: 1 }}
    >
      <Pressable
        onPress={() => Linking.openURL(url)}
        style={({ pressed }) => ({
          backgroundColor: color,
          borderRadius: 12,
          paddingVertical: 12,
          alignItems: "center",
          flexDirection: "row",
          justifyContent: "center",
          gap: 6,
          opacity: pressed ? 0.85 : 1,
        })}
      >
        <ExternalLink size={14} color="white" strokeWidth={2.5} />
        <Text
          style={{ fontFamily: theme.fontBold, fontSize: 14, color: "white" }}
        >
          {label}
        </Text>
      </Pressable>
    </Animated.View>
  );
}

export default function Contact() {
  const globalStyle = styleFactory();
  return (
    <SafeAreaView style={[globalStyle.screen]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 16, paddingBottom: 32 }}
      >
        <Animated.Text
          entering={FadeInDown.duration(400)}
          style={{
            fontSize: 30,
            textAlign: "center",
            color: "rgb(225,0,0)",
            marginBottom: 20,
            marginTop: 6,
          }}
        >
          Contact Us
        </Animated.Text>

        {/* Organisation */}
        <SectionCard delay={50}>
          <Text
            style={{
              fontFamily: theme.fontBold,
              fontSize: 18,
              color: theme.sectionHeadingColor,
              marginBottom: 2,
            }}
          >
            Expressions India
          </Text>
          <Text
            style={{
              fontFamily: theme.font,
              fontSize: 13,
              color: "hsl(0,0%,50%)",
              marginBottom: 14,
            }}
          >
            The Life Skills & National School Mental Health Program
          </Text>
          <View
            style={{
              height: 1,
              backgroundColor: theme.backgroundColorDark,
              marginBottom: 14,
            }}
          />
          <Text
            style={{
              fontFamily: theme.fontBold,
              fontSize: 15,
              color: theme.text,
            }}
          >
            Dr. Jitendra Nagpal
          </Text>
          <Text
            style={{
              fontFamily: theme.font,
              fontSize: 13,
              color: "hsl(0,0%,50%)",
              marginTop: 2,
            }}
          >
            M.D, D.N.B · Program Director
          </Text>
          <Text
            style={{
              fontFamily: theme.font,
              fontSize: 13,
              color: "hsl(0,0%,50%)",
            }}
          >
            Sr. Consultant Psychiatrist & Head
          </Text>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              marginTop: 10,
            }}
          >
            <MapPin size={13} color="hsl(0,0%,55%)" strokeWidth={2} />
            <Text
              style={{
                fontFamily: theme.font,
                fontSize: 13,
                color: "hsl(0,0%,55%)",
              }}
            >
              Moolchand Medicity, Lajpat Nagar, New Delhi
            </Text>
          </View>
        </SectionCard>

        {/* Email */}
        <SectionCard delay={100}>
          <SectionLabel>Email</SectionLabel>
          <View style={{ gap: 2 }}>
            {[
              "jnagpal10@gmail.com",
              "contactexpressions.india@gmail.com",
              "expressionsindia2005@gmail.com",
            ].map((email) => (
              <ContactRow
                key={email}
                icon={<Mail size={14} color={lightRed} strokeWidth={2} />}
                text={email}
                onPress={() => Linking.openURL(`mailto:${email}`)}
              />
            ))}
            <View
              style={{
                height: 1,
                backgroundColor: theme.backgroundColorDark,
                marginVertical: 10,
              }}
            />
            <Text
              style={{
                fontFamily: theme.font,
                fontSize: 12,
                color: "hsl(0,0%,55%)",
                marginBottom: 6,
              }}
            >
              For Indian Journal of School Health & Wellbeing queries:
            </Text>
            <ContactRow
              icon={<Mail size={14} color={lightRed} strokeWidth={2} />}
              text="journal@expressionsindia.org"
              onPress={() =>
                Linking.openURL("mailto:journal@expressionsindia.org")
              }
            />
          </View>
        </SectionCard>

        {/* Phone */}
        <SectionCard delay={150}>
          <SectionLabel>Mobile</SectionLabel>
          <View style={{ gap: 2 }}>
            {[
              "+91 93112 75888",
              "+91 95608 80038",
              "+91 98100 54860",
              "+91 93100 86792",
              "+91 78359 22093",
            ].map((num) => (
              <ContactRow
                key={num}
                icon={<Phone size={14} color={lightRed} strokeWidth={2} />}
                text={num}
                onPress={() => Linking.openURL(`tel:${num.replace(/\s/g, "")}`)}
              />
            ))}
          </View>
        </SectionCard>

        {/* Social */}
        <SectionCard delay={200}>
          <SectionLabel>Follow Us</SectionLabel>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <SocialButton
              label="Facebook"
              url="https://www.facebook.com/Expressions-India-Healthy-Schools-Healthy-India-149959487891/?ref=settings"
              color="#1877F2"
              delay={220}
            />
            <SocialButton
              label="YouTube"
              url="https://www.youtube.com/channel/UCAMRykicei1GOuiT8ac1xXA/videos"
              color="#FF0000"
              delay={260}
            />
          </View>
        </SectionCard>

        <Link href="/contact/writetous" asChild>
          <Button
            style={{
              // alignSelf: "stretch",
              borderRadius: 14,
              marginTop: 4,
              paddingHorizontal: 40,
              marginHorizontal: "auto",
              backgroundColor: "rgba(255, 0, 0, 1)",
            }}
          >
            Write To Us
          </Button>
        </Link>
      </ScrollView>
    </SafeAreaView>
  );
}
