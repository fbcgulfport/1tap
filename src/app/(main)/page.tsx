import { LinkPage } from "~/components/LinkPage"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default function Home() {
	return <LinkPage categoryId="main" />
}
