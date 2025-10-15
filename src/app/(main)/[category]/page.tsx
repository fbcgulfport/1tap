import { LinkPage } from "~/components/LinkPage"

export const dynamic = "force-dynamic"
export const revalidate = 0

export default async function Page({
	params
}: {
	params: Promise<{ category: string }>
}) {
	const { category } = await params
	return <LinkPage categoryId={category} />
}
