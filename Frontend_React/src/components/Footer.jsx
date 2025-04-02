const Footer = () => {
    return (
        <footer className=" bg-gray-100 py-5 text-center border-t border-gray-200">

            <div className="space-x-4 mb-4">
                <a href="/policies-and-rules" className="text-gray-600 hover:text-gray-900">Policies and Rules</a>
                <a href="/legal-notice" className="text-gray-600 hover:text-gray-900">Legal Notice</a>
                <a href="/product-listing-policy" className="text-gray-600 hover:text-gray-900">Product Listing Policy</a>
                <a href="/intellectual-property-protection" className="text-gray-600 hover:text-gray-900">Intellectual Property Protection</a>
                <a href="/privacy-policy" className="text-gray-600 hover:text-gray-900">Privacy Policy</a>
                <a href="/terms-of-use" className="text-gray-600 hover:text-gray-900">Terms of Use</a>
                <a href="/integrity-compliance" className="text-gray-600 hover:text-gray-900">Integrity Compliance</a>
            </div>


            <div className="text-gray-600 text-sm">
                © 1888-2025 Tamacat.com. All Rights Reserved: TAMACAT · Business License: 34G34GRG35 · Cybersecurity · Messenger · 00000000
            </div>
        </footer>
    );
}
export default Footer;