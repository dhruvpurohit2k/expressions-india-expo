import { useState } from "react";
import { WebView } from "react-native-webview";
import { theme } from "@/src/theme";

interface JustifiedTextProps {
  /** The text content(s) to render. Pass multiple strings to create multiple paragraphs. */
  paragraphs: string[];
  /** Font size in px, defaults to 14 */
  fontSize?: number;
  /** Line height in px, defaults to 22 */
  lineHeight?: number;
  /** Text colour, defaults to theme.text */
  color?: string;
  /** Background colour, defaults to white */
  backgroundColor?: string;
  /** Whether to render as an ordered list with styled badges */
  isOrderedList?: boolean;
}

/**
 * Renders paragraphs with true text justification.
 *
 * `textAlign: 'justify'` is broken in React Native on Android 15+. The only
 * cross-platform fix is to delegate rendering to a WebView, which uses the
 * browser's CSS text engine. Height is auto-sized via a postMessage from the
 * page so content is never clipped.
 */
export default function JustifiedText({
  paragraphs,
  fontSize = 14,
  lineHeight = 22,
  color = theme.text,
  backgroundColor = theme.backgroundColorLight,
  isOrderedList = false,
}: JustifiedTextProps) {
  // Start with a safe minimum; will be updated once the page reports its real height.
  const [height, setHeight] = useState(paragraphs.length * 100);

  const paragraphHtml = isOrderedList
    ? `<ol>\n` +
      paragraphs
        .map((p) => `  <li><span>${escapeHtml(p)}</span></li>`)
        .join("\n") +
      `\n</ol>`
    : paragraphs.map((p) => `<p>${escapeHtml(p)}</p>`).join("\n");

  const html = `<!DOCTYPE html>
<html>
<head>
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0">
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    html, body {
      background-color: ${backgroundColor};
      overflow: hidden;
    }
    p {
      font-family: -apple-system, 'Inter', sans-serif;
      font-size: ${fontSize}px;
      line-height: ${lineHeight}px;
      color: ${color};
      text-align: justify;
      margin-bottom: ${lineHeight * 0.8}px;
    }
    p:last-child { margin-bottom: 0; }
    ol {
      list-style: none;
      counter-reset: item-counter;
      padding: 0;
      margin: 0;
    }
    li {
      counter-increment: item-counter;
      display: flex;
      flex-direction: row;
      align-items: flex-start;
      margin-bottom: 12px;
    }
    li:last-child {
      margin-bottom: 0;
    }
    li::before {
      content: counter(item-counter);
      display: flex;
      align-items: center;
      justify-content: center;
      width: 18px;
      height: 18px;
      border-radius: 9px;
      background-color: rgba(229, 57, 53, 0.12);
      color: #e53935;
      font-family: -apple-system, 'Inter', sans-serif;
      font-weight: bold;
      font-size: 10px;
      margin-right: 12px;
      margin-top: 2px;
      flex-shrink: 0;
    }
    span {
      font-family: -apple-system, 'Inter', sans-serif;
      font-size: ${fontSize}px;
      line-height: ${lineHeight}px;
      color: ${color};
      text-align: justify;
      flex: 1;
    }
  </style>
</head>
<body>
${paragraphHtml}
<script>
  // After layout, report the true document height back to React Native.
  function sendHeight() {
    var h = document.documentElement.scrollHeight;
    window.ReactNativeWebView.postMessage(String(h));
  }
  // Fire once the DOM is ready, then again after images etc. load.
  document.addEventListener('DOMContentLoaded', sendHeight);
  window.addEventListener('load', sendHeight);
</script>
</body>
</html>`;

  return (
    <WebView
      originWhitelist={["*"]}
      source={{ html }}
      style={{ height, backgroundColor }}
      scrollEnabled={false}
      showsVerticalScrollIndicator={false}
      showsHorizontalScrollIndicator={false}
      javaScriptEnabled={true}
      onMessage={(event) => {
        const reportedHeight = parseInt(event.nativeEvent.data, 10);
        if (!isNaN(reportedHeight) && reportedHeight > 0) {
          setHeight(reportedHeight);
        }
      }}
    />
  );
}

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}
