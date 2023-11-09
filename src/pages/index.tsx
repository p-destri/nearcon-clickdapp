import { useDefaultLayout } from '@/hooks/useLayout';
import type { NextPageWithLayout } from '@/utils/types';

const HomePage: NextPageWithLayout = () => {

  return (
    <div
      className="h-screen w-screen flex items-center justify-center"
    >
      <div
        className="
          bg-[#241042] px-[32px] py-[18px] rounded-[16px]
          flex flex-col items-center justify-center space-y-2
        "
      >
        <span
          className="text-white"
        >
          Powered By
        </span>

        <img
          src="https://2syrq3q4144.makeswift.site/_next/image?url=https%3A%2F%2Fstorage.googleapis.com%2Fs.mkswft.com%2FRmlsZToyY2U0OWZjOC1lOTU2LTQ3Y2MtYjZkMi04MmE2YWY3ZWYwYWU%3D%2FClickDapp%2520-%2520Logo%25203.png&w=256&q=75"
        />
      </div>
    </div>
  )
}

HomePage.getLayout = useDefaultLayout

export default HomePage
