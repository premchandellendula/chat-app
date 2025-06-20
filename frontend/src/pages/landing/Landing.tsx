import { Link } from "react-router-dom";
import ChatIcon from "../../components/icons/ChatIcon";
import Lock from "../../components/icons/Lock";
import Community from "../../components/icons/Community";

const Landing = () => {
    return (
        <div className="w-[90%] mx-auto p-4 bg-white rounded-lg">
            <div className="flex justify-between items-center mb-12">
                <div className="flex items-center space-x-2">
                    <span className="text-2xl font-bold text-gray-800">ChatApp</span>
                </div>
                
                <div className="flex items-center space-x-4">
                    <Link to={'/signin'}>
                        <button className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium cursor-pointer">
                            Sign In
                        </button>
                    </Link>
                    <Link to={'/signup'}>
                        <button className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium cursor-pointer">
                            Sign Up
                        </button>
                    </Link>
                </div>
            </div>
        
            <div className="text-center mb-12">
                <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
                    Simple, Fast Messaging
                </h1>
                
                <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
                    Connect with friends, family, and colleagues through secure messaging. 
                    Send texts, share files, and stay in touch effortlessly.
                </p>
        
                <Link to={'/signup'}>
                    <button className="px-8 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-lg font-semibold mr-4 cursor-pointer">
                        Get Started
                    </button>
                </Link>
            </div>
        

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                        <ChatIcon />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Instant Messages</h3>
                    <p className="text-gray-600">Send and receive messages in real-time with instant delivery.</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                        <Lock />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Secure & Private</h3>
                    <p className="text-gray-600">Your conversations are protected with end-to-end encryption.</p>
                </div>
                
                <div className="bg-gray-50 p-6 rounded-lg">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                        <Community />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Group Chats</h3>
                    <p className="text-gray-600">Create groups and chat with multiple people at once.</p>
                </div>
            </div>
        </div>
    );
}

export default Landing