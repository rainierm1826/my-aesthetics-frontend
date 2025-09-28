import type { Metadata } from "next";
import Navbar from "@/components/navigations/Navbar";
import "./globals.css";
import Footer from "@/components/sections/Footer";
import QueryProvider from "@/provider/QueryProvider";
import { Toaster } from "sonner";
import Script from "next/script";
import { inter } from "@/components/fonts/fonts";

export const metadata: Metadata = {
  title: "MY Aesthetics Brow Studio",
  description: "",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <head>
        <Script
          id="flowise-chatbot"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html: `
              import('https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js')
                .then(module => {
                  const Chatbot = module.default;
                  Chatbot.init({
                    chatflowid: "b690697d-c2be-428b-8ea8-be2e3d72a2ec",
                    apiHost: "https://my-aesthetics-chatbot.onrender.com",
                    chatflowConfig: {
                      
                    },
                    observersConfig: {},
                    theme: {
                      button: {
                        backgroundColor: '#D4C373',
                        right: 20,
                        bottom: 20,
                        size: 52,
                        dragAndDrop: true,
                        iconColor: 'white',
                        customIconSrc: 'https://freesvg.org/img/1538298822.png',
                        autoWindowOpen: {
                          autoOpen: false,
                          openDelay: 2,
                          autoOpenOnMobile: false
                        }
                      },
                     
                                              customCSS: \`
                        .flowise-chatbot {
                          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                        }
                        .flowise-chatbot-button {
                          box-shadow: 0 4px 12px rgba(212, 195, 115, 0.3);
                          transition: all 0.3s ease;
                        }
                        .flowise-chatbot-button:hover {
                          transform: translateY(-2px);
                          box-shadow: 0 6px 20px rgba(212, 195, 115, 0.4);
                          background-color: #c2b05e !important;
                        }
                        /* Hide process flow debug information */
                        .flowise-chatbot *:contains("Process Flow"),
                        .flowise-chatbot *:contains("Start"),
                        .flowise-chatbot *:contains("Agent "),
                        [data-testid*="process"],
                        [class*="process-flow"],
                        [class*="debug-info"] {
                          display: none !important;
                        }
                        /* Hide messages that start with ** */
                        .flowise-chatbot [class*="message"]:has(*:contains("**Process Flow**")) {
                          display: none !important;
                        }
                        /* Hide Flowise branding footer */
                        .lite-badge,
                        #lite-badge,
                        span.w-full.text-center[class*="px-"][class*="pt-"][class*="pb-"][class*="m-auto"],
                        span:contains("Powered by") {
                          display: none !important;
                          visibility: hidden !important;
                          height: 0 !important;
                          max-height: 0 !important;
                          overflow: hidden !important;
                          opacity: 0 !important;
                        }
                        /* Target parent containers that might contain the branding */
                        [class*="w-full"][class*="text-center"]:has(.lite-badge) {
                          display: none !important;
                        }
                        /* Add bottom spacing to compensate for removed footer */
                        .flowise-chatbot [class*="input"],
                        .flowise-chatbot input[type="text"],
                        .flowise-chatbot textarea,
                        .flowise-chatbot [class*="text-input"],
                        .flowise-chatbot-input,
                        .flowise-chatbot-container > div:last-child,
                        .flowise-chatbot-window > div:last-child {
                          margin-bottom: 20px !important;
                          padding-bottom: 10px !important;
                        }
                        /* Alternative: Add padding to the chat window bottom */
                        .flowise-chatbot-window,
                        .flowise-chat-window {
                          padding-bottom: 25px !important;
                        }
                      \`,
                      chatWindow: {
                        showTitle: true,
                        showAgentMessages: false,
                        title: 'MY Assistant',
                        titleAvatarSrc: 'https://freesvg.org/img/1538298822.png',
                        welcomeMessage: 'Hello! I\\'m MY Assistant, your personal AI helper. How can I assist you today?',
                        errorMessage: 'I apologize, but I\\'m experiencing some technical difficulties. Please try again in a moment.',
                        backgroundColor: '#ffffff',
                        backgroundImage: '',
                        height: 450,
                        width: 420,
                        fontSize: 16,
                        starterPrompts: [
                          "What can you help me with?",
                          "Where are you located?",
                          "What services do you offer?"
                        ],
                        starterPromptFontSize: 15,
                        clearChatOnReload: false,
                        sourceDocsTitle: 'Reference Sources:',
                        renderHTML: true,
                        botMessage: {
                          backgroundColor: '#faf9f7',
                          textColor: '#2c2c2c',
                          showAvatar: true,
                          avatarSrc: 'https://freesvg.org/img/1538298822.png'
                        },
                        userMessage: {
                          backgroundColor: '#D4C373',
                          textColor: '#ffffff',
                          showAvatar: true,
                          avatarSrc: 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'
                        },
                        textInput: {
                          placeholder: 'Ask MY Assistant anything...',
                          backgroundColor: '#ffffff',
                          textColor: '#2c2c2c',
                          sendButtonColor: '#D4C373',
                          maxChars: 200,
                          maxCharsWarningMessage: 'Please keep your message under 200 characters for the best experience.',
                          autoFocus: true,
                          sendMessageSound: true,
                          sendSoundLocation: 'send_message.mp3',
                          receiveMessageSound: true,
                          receiveSoundLocation: 'receive_message.mp3'
                        },
                        feedback: {
                          color: '#D4C373'
                        },
                        dateTimeToggle: {
                          date: true,
                          time: true
                        },
                        footer: false
                      }
                    }
                  });
                })
                .catch(error => {
                  console.error('Failed to load Flowise chatbot:', error);
                });
            `,
          }}
        />
      </head>
      <body className={`${inter.className} `}>
        <QueryProvider>
          <Navbar />
          <main>{children}</main>
          <Toaster />
          <Footer />
        </QueryProvider>
      </body>
    </html>
  );
}
