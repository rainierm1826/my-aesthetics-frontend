"use client";

import { useUserStore } from "@/provider/store/userStore";
import Script from "next/script";
import { useEffect } from "react";

export default function FlowiseChatbot() {
  const { user, isUserLoading } = useUserStore();

  useEffect(() => {
    if (!isUserLoading && user?.image) {
      const userStorage = localStorage.getItem('user-storage');
      if (userStorage) {
        const userData = JSON.parse(userStorage);
        console.log('User image:', userData.state?.user?.image);
      }
    }
  }, [user, isUserLoading]);

  return (
    <Script
      id="flowise-chatbot"
      strategy="afterInteractive"
      dangerouslySetInnerHTML={{
        __html: `
          (function() {
            // Get user data from localStorage
            const userStorage = localStorage.getItem('user-storage');
            let userImage = '';
            
            if (userStorage) {
              try {
                const userData = JSON.parse(userStorage);
                userImage = userData.state?.user?.image || '';
              } catch (e) {
                console.error('Failed to parse user data:', e);
              }
            }

            import('https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js')
              .then(module => {
                const Chatbot = module.default;
                Chatbot.init({
                  chatflowid: "55594acc-2a75-40f6-b7cb-b52b4800c4ae",
                  apiHost: "https://ai.myaestheticsbrowstudio.com",
                  chatflowConfig: {},
                  observersConfig: {},
                  theme: {
                    button: {
                      backgroundColor: '#D4C373',
                      right: 20,
                      bottom: 20,
                      size: 52,
                      dragAndDrop: true,
                      iconColor: 'white',
                      customIconSrc: '/chatBot.png',
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
                      titleAvatarSrc: '/chatBot.png',
                      welcomeMessage: 'Hello! I\\'m MY Assistant, your personal AI helper. How can I assist you today?',
                      errorMessage: 'I apologize, but I\\'m experiencing some technical difficulties. Please contact us at https://www.facebook.com/myaestheticsbatangascity for further assistance.',
                      backgroundColor: '#ffffff',
                      backgroundImage: '',
                      height: 450,
                      width: 420,
                      fontSize: 16,
                      starterPrompts: [
                        "What services do you offer?",
                        "Where are your branches located?",
                        "How do I book an appointment?",
                        "Can I cancel an appointment?",
                        "What is pro aestheticians?",
                      ],
                      starterPromptFontSize: 10,
                      clearChatOnReload: false,
                      sourceDocsTitle: 'Reference Sources:',
                      renderHTML: true,
                      botMessage: {
                        backgroundColor: '#faf9f7',
                        textColor: '#2c2c2c',
                        showAvatar: true,
                        avatarSrc: '/chatBot.png'
                      },
                      userMessage: {
                        backgroundColor: '#D4C373',
                        textColor: '#ffffff',
                        showAvatar: true,
                        avatarSrc: userImage || 'https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png'
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
          })();
        `,
      }}
    />
  );
}
