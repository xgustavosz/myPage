export const fetchHygraphQuery = async <T>(
  query: string,
  revalidate?: number,
): Promise<T> => {
  try {
    const response = await fetch(process.env.HYGRAPH_URL!, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${process.env.HYGRAPH_TOKEN}`,
      },
      next: {
        revalidate,
      },
      body: JSON.stringify({ query }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(
        'Failed to fetch data:',
        response.status,
        response.statusText,
        errorText,
      )
      throw new Error(
        `Network response was not ok: ${response.status} ${response.statusText}`,
      )
    }

    const { data, errors } = await response.json()

    if (errors) {
      console.error('GraphQL errors:', errors)
      throw new Error('GraphQL query failed')
    }

    if (!data) {
      throw new Error('No data returned from the query')
    }

    return data
  } catch (error) {
    console.error('Fetch error:', error)
    throw error
  }
}
