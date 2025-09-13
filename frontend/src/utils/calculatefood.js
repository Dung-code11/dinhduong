// Hàm tính toán các giá trị phụ thuộc
export const calculateCarbohydrate = (item) => {
    return 100 - ((item.water) + (item.protein) + (item.fat) + (item.ash));
};

export const calculateEnergy = (item) => {
    return 4 * (item.protein) + 9 * (item.fat) + 4 * calculateCarbohydrate(item);
};

export const calculateE = (item) => {
    return ((item.edible) * calculateEnergy(item)) / 100;
};

export const calculateP = (item) => {
    return (item.protein) * calculateEnergy(item) / 100;
};

export const calculateL = (item) => {
    return (item.fat) * calculateEnergy(item) / 100;
};

export const calculateG = (item) => {
    return calculateCarbohydrate(item) * calculateEnergy(item) / 100;
};
export const getPageNumbers = (currentPage, totalPages) => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
        for (let i = 1; i <= totalPages; i++) {
            pages.push(i);
        }
    } else {
        pages.push(1);
        let startPage = Math.max(2, currentPage - 1);
        let endPage = Math.min(totalPages - 1, currentPage + 1);

        if (currentPage <= 3) {
            endPage = 4;
        } else if (currentPage >= totalPages - 2) {
            startPage = totalPages - 3;
        }

        if (startPage > 2) {
            pages.push('...');
        }

        for (let i = startPage; i <= endPage; i++) {
            pages.push(i);
        }

        if (endPage < totalPages - 1) {
            pages.push('...');
        }
        pages.push(totalPages);
    }

    return pages;
};

export const convertToComponentFormat = (item, calculationFunctions) => {
    const {
        calculateCarbohydrate,
        calculateEnergy,
        calculateE,
        calculateP,
        calculateL,
        calculateG
    } = calculationFunctions;

    return {
        id: item.id,
        name: item.material,
        group: item.category?.categoryName || "",
        proteinType: item.loaiProtein === "THUC_VAT" ? "Thực vật" : "Động Vật",
        Edible: item.edible,
        Water: item.water,
        Protein: item.protein,
        Fat: item.fat,
        Fiber: item.fiber,
        Ash: item.ash,
        Calci: item.calci,
        Phosphorous: item.phosphorous,
        Iron: item.iron,
        Zinc: item.zinc,
        Sodium: item.sodium,
        Potassium: item.potassium,
        Magnesium: item.magnesium,
        Manganese: item.manganese,
        Copper: item.copper,
        Selenium: item.selenium,
        "Vitamin C": item.vitaminC,
        Thiamine: item.thiamine,
        Riboflavin: item.riboflavin,
        Niacin: item.niacin,
        "Pantothenic acid": item.pantothenicAcid,
        "Vitamin B6": item.vitaminB6,
        Folate: item.folate,
        "Folic acid": item.folicAcid,
        Biotin: item.biotin,
        "Vitamin B12": item.vitaminB12,
        Retinol: item.retinol,
        "Vitamin D": item.vitaminD,
        "Vitamin E": item.vitaminE,
        "Vitamin K": item.vitaminK,
        "b-carotene": item.betaCarotene,
        "a-carotene": item.alphaCarotene,
        "b-cryptoxanthin": item.betaCryptoxanthin,
        Lycopene: item.lycopene,
        "Lutein + zeaxanthin": item.luteinZeaxanthin,
        "Isoflavone tổng số": item.isoflavoneTongSo,
        Daidzein: item.daidzein,
        Genistein: item.genistein,
        Glycetin: item.glycetin,
        Purine: item.purine,
        "Palmitic (C16:0)": item.palmitic,
        "Margaric (C17:0)": item.margaric,
        "Stearic (C18:0)": item.stearic,
        "Arachidic (C20:0)": item.arachidic,
        "Behenic (C22:0)": item.behenic,
        "Lignoceric (C24:0)": item.lignoceric,
        "TS acid béo không no 1 nối đôi": item.tsAxitBeoKhongNo1NoiDoi,
        "Myristoleic (C14:1)": item.myristoleic,
        "Palmitoleic (C16:1)": item.palmitoleic,
        "Oleic (C18:1)": item.oleic,
        "TS acid béo không no nhiều nối đôi": item.tsAxitBeoKhongNoNhieuNoiDoi,
        Linoleic: item.linoleic,
        Linolenic: item.linolenic,
        "Arachidonic (C20:4)": item.arachidonic,
        "EPA (C20:5 n3)": item.epa,
        "DHA (C22:6 n3)": item.dha,
        "TS acid béo trans": item.tsAxitBeoTrans,
        Cholesterol: item.cholesterol,
        Phytosterol: item.phytosterol,
        Lysin: item.lysin,
        Methionin: item.methionin,
        Tryptophan: item.tryptophan,
        Phenylalanin: item.phenylalanin,
        Threonin: item.threonin,
        Valine: item.valine,
        Leucine: item.leucine,
        Isoleucine: item.isoleucine,
        Arginine: item.arginine,
        Histidine: item.histidine,
        Cystine: item.cystine,
        Tyrosine: item.tyrosine,
        Alanine: item.alanine,
        "Aspartic acid": item.asparticAcid,
        "Glutamic acid": item.glutamicAcid,
        Glycine: item.glycine,
        Proline: item.proline,
        Serine: item.serine,
        // Tính toán các trường phụ thuộc
        Carbohydrate: calculateCarbohydrate(item),
        Energy: calculateEnergy(item),
        E: calculateE(item),
        P: calculateP(item),
        L: calculateL(item),
        G: calculateG(item),
        "Vitamin A -RAE": null // Có thể tính toán sau nếu cần
    };
};