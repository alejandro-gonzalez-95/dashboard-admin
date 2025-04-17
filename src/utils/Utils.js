export const getNewSectionsByType = (type) => {
    const newSections = []

    if (type === '1') {
        const sectionsCount = 1
        for (let i = 0; i < sectionsCount; i++) {
            const newSection1 = {
                id: i + 1,
                position: i + 1,
                aspectRatio: 16/9,
                sectionImages: []
            }

            newSections.push(newSection1)
        }
    }

    if (type === '2') {
        const newSection1 = {
            id: 1,
            position: 1,
            aspectRatio: 8/9,
            sectionImages: []
        }

        newSections.push(newSection1)

        const newSection2 = {
            id: 2,
            position: 2,
            aspectRatio: 16/9,
            sectionImages: []
        }

        newSections.push(newSection2)

        const newSection3 = {
            id: 3,
            position: 3,
            aspectRatio: 16/9,
            sectionImages: []
        }

        newSections.push(newSection3)
    }

    if (type === '3') {
        const newSection1 = {
            id: 1,
            position: 1,
            aspectRatio: 16/9,
            sectionImages: []
        }

        newSections.push(newSection1)

        const newSection2 = {
            id: 2,
            position: 2,
            aspectRatio: 8/9,
            sectionImages: []
        }

        newSections.push(newSection2)

        const newSection3 = {
            id: 3,
            position: 3,
            aspectRatio: 16/9,
            sectionImages: []
        }

        newSections.push(newSection3)
    }

    return newSections
}

export const getFileFromDataURL = async (dataURL, fileName, type) => {
    try {
        const response = await fetch(dataURL)
        const blob = await response.blob()
        return new File([blob], fileName, { type: type })
    } catch (error) {
        console.error('Error creating file:', error)
    }

}

export const timeout = (delay) => {
    return new Promise( res => setTimeout(res, delay) );
}