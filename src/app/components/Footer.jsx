import { FaInstagram } from "react-icons/fa6";
import { FaFacebook } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { MdEmail, MdLocationOn, MdPhone } from "react-icons/md";

function Footer() {
    return (
        <div className="bg-[#031637] text-white">

            <div className="w-full border-t border-white/10 md:w-4/5 mx-auto px-6 py-16">

                {/* TOP GRID */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-12 lg:gap-8 mb-12">

                    {/* BRAND */}
                    <div className="sm:col-span-2 md:col-span-3 lg:col-span-2">

                        <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
                            Arena<span className="text-[#00D4FF]">X</span>
                        </h1>

                        <p className="text-[#777] mt-4 leading-relaxed max-w-sm">
                            ArenaX makes sports field booking simple and seamless by connecting players with top-quality turfs and arenas. Using a modern and user-friendly platform, we help teams and sports lovers find, schedule, and book the perfect field for every match, training session, and tournament.
                        </p>
                        {/* SOCIAL LINKS */}
                        <div className="mt-6">

                            <h2 className="text-[16px] font-semibold mb-4">
                                Follow Us
                            </h2>

                            <div className="flex flex-row gap-4">

                                <FaInstagram
                                    size={38}
                                    className="text-black bg-white p-2 rounded-full hover:bg-purple-600 hover:text-white transition-all cursor-pointer"
                                />

                                <FaFacebook
                                    size={38}
                                    className="text-black bg-white p-2 rounded-full hover:bg-blue-600 hover:text-white transition-all cursor-pointer"
                                />

                                <FaXTwitter
                                    size={38}
                                    className="text-black bg-white p-2 rounded-full hover:bg-gray-800 hover:text-white transition-all cursor-pointer"
                                />
                            </div>
                        </div>
                    </div>

                    {/* PRODUCTS */}
                    <div>
                        <h1 className="text-[18px] font-semibold">
                            Products
                        </h1>

                        <ul className="text-[#777] mt-3 flex flex-col gap-2">

                            <li className="hover:text-white cursor-pointer transition-colors">
                                Features
                            </li>

                            <li className="hover:text-white cursor-pointer transition-colors">
                                Pricing
                            </li>


                            <li className="hover:text-white cursor-pointer transition-colors">
                                Integrations
                            </li>
                        </ul>
                    </div>

                    {/* COMPANY */}
                    <div>
                        <h1 className="text-[18px] font-semibold">
                            Company
                        </h1>

                        <ul className="text-[#777] mt-3 flex flex-col gap-2">

                            <li className="hover:text-white cursor-pointer transition-colors">
                                About
                            </li>

                            <li className="hover:text-white cursor-pointer transition-colors">
                                Blog
                            </li>

                            <li className="hover:text-white cursor-pointer transition-colors">
                                Careers
                            </li>

                            <li className="hover:text-white cursor-pointer transition-colors">
                                Press
                            </li>
                        </ul>
                    </div>

                    {/* RESOURCES */}
                    <div>
                        <h1 className="text-[18px] font-semibold">
                            Resources
                        </h1>

                        <ul className="text-[#777] mt-3 flex flex-col gap-2">

                            <li className="hover:text-white cursor-pointer transition-colors">
                                Documentation
                            </li>

                            <li className="hover:text-white cursor-pointer transition-colors">
                                Help Center
                            </li>

                            <li className="hover:text-white cursor-pointer transition-colors">
                                Community
                            </li>

                            <li className="hover:text-white cursor-pointer transition-colors">
                                Contact
                            </li>
                        </ul>
                    </div>


                    <div>
                        <h1 className="text-[18px] font-semibold">
                            Contact Us
                        </h1>

                        <div className="mt-4 flex flex-col gap-4 text-[#777] text-sm">


                            <div className="flex items-start gap-3">

                                <MdEmail
                                    size={20}
                                    className="text-[#00D4FF] mt-0.5"
                                />

                                <div>
                                    <p className="text-white font-medium">
                                        Email
                                    </p>

                                    <p className="hover:text-white transition-colors cursor-pointer">
                                        support@arenax.com
                                    </p>
                                </div>
                            </div>

                            {/* PHONE */}
                            <div className="flex items-start gap-3">

                                <MdPhone
                                    size={20}
                                    className="text-[#00D4FF] mt-0.5"
                                />

                                <div>
                                    <p className="text-white font-medium">
                                        Phone
                                    </p>

                                    <p className="hover:text-white transition-colors cursor-pointer">
                                        +880 1234-567890
                                    </p>
                                </div>
                            </div>

                            {/* LOCATION */}
                            <div className="flex items-start gap-3">

                                <MdLocationOn
                                    size={20}
                                    className="text-[#00D4FF] mt-0.5"
                                />

                                <div>
                                    <p className="text-white font-medium">
                                        Location
                                    </p>

                                    <p>
                                        Dhaka, Bangladesh
                                    </p>
                                </div>
                            </div>
                        </div>

                        
                    </div>
                </div>

                {/* DIVIDER */}
                <hr className="border-[#333]" />

                {/* BOTTOM */}
                <div className="flex flex-col md:flex-row justify-between items-center gap-6 mt-8">

                    <div className="text-center md:text-left text-[#777] text-sm">
                        © 2026 ArenaX Inc. All rights reserved.
                    </div>

                    <div className="flex flex-wrap justify-center gap-6 md:gap-10 items-center text-sm text-[#777]">

                        <p className="hover:text-white cursor-pointer transition-colors">
                            Privacy Policy
                        </p>

                        <p className="hover:text-white cursor-pointer transition-colors">
                            Terms of Service
                        </p>

                        <p className="hover:text-white cursor-pointer transition-colors">
                            Cookies
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Footer;