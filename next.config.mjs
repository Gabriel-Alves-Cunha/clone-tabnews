/// @ts-check

import MillionLint from "@million/lint";

const nextConfig = {
	rsc: true,
};

export default MillionLint.next({ rsc: true })(nextConfig);
