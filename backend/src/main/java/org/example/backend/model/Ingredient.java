package org.example.backend.model;

import jakarta.persistence.*;

@Entity
@Table(name = "thanh_phan")
public class Ingredient {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "ten_nguyen_lieu", nullable = false, length = 255)
    private String material;

    @ManyToOne
    @JoinColumn(name = "danh_muc",referencedColumnName = "id", nullable = false)
    private Category category;

    private Double edible;
    private Double water;
    private Double protein;
    private Double fat;
    private Double fiber;
    private Double ash;
    private Double calci;
    private Double phosphorous;
    private Double iron;
    private Double zinc;
    private Double sodium;
    private Double potassium;
    private Double magnesium;
    private Double manganese;
    private Double copper;
    private Double selenium;
    private Double vitaminC;
    private Double thiamine;
    private Double riboflavin;
    private Double niacin;
    private Double pantothenicAcid;
    private Double vitaminB6;
    private Double folate;
    private Double folicAcid;
    private Double biotin;
    private Double vitaminB12;
    private Double retinol;
    private Double vitaminD;
    private Double vitaminE;
    private Double vitaminK;
    private Double betaCarotene;
    private Double alphaCarotene;
    private Double betaCryptoxanthin;
    private Double lycopene;
    private Double luteinZeaxanthin;
    private Double isoflavoneTongSo;
    private Double daidzein;
    private Double genistein;
    private Double glycetin;
    private Double purine;
    private Double palmitic;
    private Double margaric;
    private Double stearic;
    private Double arachidic;
    private Double behenic;
    private Double lignoceric;
    private Double tsAxitBeoKhongNo1NoiDoi;
    private Double myristoleic;
    private Double palmitoleic;
    private Double oleic;
    private Double tsAxitBeoKhongNoNhieuNoiDoi;
    private Double linoleic;
    private Double linolenic;
    private Double arachidonic;
    private Double epa;
    private Double dha;
    private Double tsAxitBeoTrans;
    private Double cholesterol;
    private Double phytosterol;
    private Double lysin;
    private Double methionin;
    private Double tryptophan;
    private Double phenylalanin;
    private Double threonin;
    private Double valine;
    private Double leucine;
    private Double isoleucine;
    private Double arginine;
    private Double histidine;
    private Double cystine;
    private Double tyrosine;
    private Double alanine;
    private Double asparticAcid;
    private Double glutamicAcid;
    private Double glycine;
    private Double proline;
    private Double serine;
    @Enumerated(EnumType.STRING)
    @Column(name = "loai_protein")
    private LoaiProtein loaiProtein;
    @ManyToOne
    @JoinColumn(name = "tao_boi_id", referencedColumnName = "id", nullable = false)
    private User user;
    @Enumerated(EnumType.STRING)
    @Column(name = "trang_thai")
    private TrangThai trangThai;
    public enum LoaiProtein {
        DONG_VAT, THUC_VAT
    }
    public enum TrangThai {
        CHO_DUYET, DA_DUYET, TU_CHOI
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMaterial() {
        return material;
    }

    public void setMaterial(String material) {
        this.material = material;
    }

    public Category getCategory() {
        return category;
    }

    public void setCategory(Category category) {
        this.category = category;
    }

    public Double getEdible() {
        return edible;
    }

    public void setEdible(Double edible) {
        this.edible = edible;
    }

    public Double getWater() {
        return water;
    }

    public void setWater(Double water) {
        this.water = water;
    }

    public Double getProtein() {
        return protein;
    }

    public void setProtein(Double protein) {
        this.protein = protein;
    }

    public Double getFat() {
        return fat;
    }

    public void setFat(Double fat) {
        this.fat = fat;
    }

    public Double getFiber() {
        return fiber;
    }

    public void setFiber(Double fiber) {
        this.fiber = fiber;
    }

    public Double getAsh() {
        return ash;
    }

    public void setAsh(Double ash) {
        this.ash = ash;
    }

    public Double getCalci() {
        return calci;
    }

    public void setCalci(Double calci) {
        this.calci = calci;
    }

    public Double getPhosphorous() {
        return phosphorous;
    }

    public void setPhosphorous(Double phosphorous) {
        this.phosphorous = phosphorous;
    }

    public Double getIron() {
        return iron;
    }

    public void setIron(Double iron) {
        this.iron = iron;
    }

    public Double getZinc() {
        return zinc;
    }

    public void setZinc(Double zinc) {
        this.zinc = zinc;
    }

    public Double getSodium() {
        return sodium;
    }

    public void setSodium(Double sodium) {
        this.sodium = sodium;
    }

    public Double getPotassium() {
        return potassium;
    }

    public void setPotassium(Double potassium) {
        this.potassium = potassium;
    }

    public Double getMagnesium() {
        return magnesium;
    }

    public void setMagnesium(Double magnesium) {
        this.magnesium = magnesium;
    }

    public Double getManganese() {
        return manganese;
    }

    public void setManganese(Double manganese) {
        this.manganese = manganese;
    }

    public Double getCopper() {
        return copper;
    }

    public void setCopper(Double copper) {
        this.copper = copper;
    }

    public Double getSelenium() {
        return selenium;
    }

    public void setSelenium(Double selenium) {
        this.selenium = selenium;
    }

    public Double getVitaminC() {
        return vitaminC;
    }

    public void setVitaminC(Double vitaminC) {
        this.vitaminC = vitaminC;
    }

    public Double getThiamine() {
        return thiamine;
    }

    public void setThiamine(Double thiamine) {
        this.thiamine = thiamine;
    }

    public Double getRiboflavin() {
        return riboflavin;
    }

    public void setRiboflavin(Double riboflavin) {
        this.riboflavin = riboflavin;
    }

    public Double getNiacin() {
        return niacin;
    }

    public void setNiacin(Double niacin) {
        this.niacin = niacin;
    }

    public Double getPantothenicAcid() {
        return pantothenicAcid;
    }

    public void setPantothenicAcid(Double pantothenicAcid) {
        this.pantothenicAcid = pantothenicAcid;
    }

    public Double getVitaminB6() {
        return vitaminB6;
    }

    public void setVitaminB6(Double vitaminB6) {
        this.vitaminB6 = vitaminB6;
    }

    public Double getFolate() {
        return folate;
    }

    public void setFolate(Double folate) {
        this.folate = folate;
    }

    public Double getFolicAcid() {
        return folicAcid;
    }

    public void setFolicAcid(Double folicAcid) {
        this.folicAcid = folicAcid;
    }

    public Double getBiotin() {
        return biotin;
    }

    public void setBiotin(Double biotin) {
        this.biotin = biotin;
    }

    public Double getVitaminB12() {
        return vitaminB12;
    }

    public void setVitaminB12(Double vitaminB12) {
        this.vitaminB12 = vitaminB12;
    }

    public Double getRetinol() {
        return retinol;
    }

    public void setRetinol(Double retinol) {
        this.retinol = retinol;
    }

    public Double getVitaminD() {
        return vitaminD;
    }

    public void setVitaminD(Double vitaminD) {
        this.vitaminD = vitaminD;
    }

    public Double getVitaminE() {
        return vitaminE;
    }

    public void setVitaminE(Double vitaminE) {
        this.vitaminE = vitaminE;
    }

    public Double getVitaminK() {
        return vitaminK;
    }

    public void setVitaminK(Double vitaminK) {
        this.vitaminK = vitaminK;
    }

    public Double getBetaCarotene() {
        return betaCarotene;
    }

    public void setBetaCarotene(Double betaCarotene) {
        this.betaCarotene = betaCarotene;
    }

    public Double getAlphaCarotene() {
        return alphaCarotene;
    }

    public void setAlphaCarotene(Double alphaCarotene) {
        this.alphaCarotene = alphaCarotene;
    }

    public Double getBetaCryptoxanthin() {
        return betaCryptoxanthin;
    }

    public void setBetaCryptoxanthin(Double betaCryptoxanthin) {
        this.betaCryptoxanthin = betaCryptoxanthin;
    }

    public Double getLycopene() {
        return lycopene;
    }

    public void setLycopene(Double lycopene) {
        this.lycopene = lycopene;
    }

    public Double getLuteinZeaxanthin() {
        return luteinZeaxanthin;
    }

    public void setLuteinZeaxanthin(Double luteinZeaxanthin) {
        this.luteinZeaxanthin = luteinZeaxanthin;
    }

    public Double getIsoflavoneTongSo() {
        return isoflavoneTongSo;
    }

    public void setIsoflavoneTongSo(Double isoflavoneTongSo) {
        this.isoflavoneTongSo = isoflavoneTongSo;
    }

    public Double getDaidzein() {
        return daidzein;
    }

    public void setDaidzein(Double daidzein) {
        this.daidzein = daidzein;
    }

    public Double getGenistein() {
        return genistein;
    }

    public void setGenistein(Double genistein) {
        this.genistein = genistein;
    }

    public Double getGlycetin() {
        return glycetin;
    }

    public void setGlycetin(Double glycetin) {
        this.glycetin = glycetin;
    }

    public Double getPurine() {
        return purine;
    }

    public void setPurine(Double purine) {
        this.purine = purine;
    }

    public Double getPalmitic() {
        return palmitic;
    }

    public void setPalmitic(Double palmitic) {
        this.palmitic = palmitic;
    }

    public Double getMargaric() {
        return margaric;
    }

    public void setMargaric(Double margaric) {
        this.margaric = margaric;
    }

    public Double getStearic() {
        return stearic;
    }

    public void setStearic(Double stearic) {
        this.stearic = stearic;
    }

    public Double getArachidic() {
        return arachidic;
    }

    public void setArachidic(Double arachidic) {
        this.arachidic = arachidic;
    }

    public Double getBehenic() {
        return behenic;
    }

    public void setBehenic(Double behenic) {
        this.behenic = behenic;
    }

    public Double getLignoceric() {
        return lignoceric;
    }

    public void setLignoceric(Double lignoceric) {
        this.lignoceric = lignoceric;
    }

    public Double getTsAxitBeoKhongNo1NoiDoi() {
        return tsAxitBeoKhongNo1NoiDoi;
    }

    public void setTsAxitBeoKhongNo1NoiDoi(Double tsAxitBeoKhongNo1NoiDoi) {
        this.tsAxitBeoKhongNo1NoiDoi = tsAxitBeoKhongNo1NoiDoi;
    }

    public Double getMyristoleic() {
        return myristoleic;
    }

    public void setMyristoleic(Double myristoleic) {
        this.myristoleic = myristoleic;
    }

    public Double getPalmitoleic() {
        return palmitoleic;
    }

    public void setPalmitoleic(Double palmitoleic) {
        this.palmitoleic = palmitoleic;
    }

    public Double getOleic() {
        return oleic;
    }

    public void setOleic(Double oleic) {
        this.oleic = oleic;
    }

    public Double getTsAxitBeoKhongNoNhieuNoiDoi() {
        return tsAxitBeoKhongNoNhieuNoiDoi;
    }

    public void setTsAxitBeoKhongNoNhieuNoiDoi(Double tsAxitBeoKhongNoNhieuNoiDoi) {
        this.tsAxitBeoKhongNoNhieuNoiDoi = tsAxitBeoKhongNoNhieuNoiDoi;
    }

    public Double getLinoleic() {
        return linoleic;
    }

    public void setLinoleic(Double linoleic) {
        this.linoleic = linoleic;
    }

    public Double getLinolenic() {
        return linolenic;
    }

    public void setLinolenic(Double linolenic) {
        this.linolenic = linolenic;
    }

    public Double getArachidonic() {
        return arachidonic;
    }

    public void setArachidonic(Double arachidonic) {
        this.arachidonic = arachidonic;
    }

    public Double getEpa() {
        return epa;
    }

    public void setEpa(Double epa) {
        this.epa = epa;
    }

    public Double getDha() {
        return dha;
    }

    public void setDha(Double dha) {
        this.dha = dha;
    }

    public Double getTsAxitBeoTrans() {
        return tsAxitBeoTrans;
    }

    public void setTsAxitBeoTrans(Double tsAxitBeoTrans) {
        this.tsAxitBeoTrans = tsAxitBeoTrans;
    }

    public Double getCholesterol() {
        return cholesterol;
    }

    public void setCholesterol(Double cholesterol) {
        this.cholesterol = cholesterol;
    }

    public Double getPhytosterol() {
        return phytosterol;
    }

    public void setPhytosterol(Double phytosterol) {
        this.phytosterol = phytosterol;
    }

    public Double getLysin() {
        return lysin;
    }

    public void setLysin(Double lysin) {
        this.lysin = lysin;
    }

    public Double getMethionin() {
        return methionin;
    }

    public void setMethionin(Double methionin) {
        this.methionin = methionin;
    }

    public Double getTryptophan() {
        return tryptophan;
    }

    public void setTryptophan(Double tryptophan) {
        this.tryptophan = tryptophan;
    }

    public Double getPhenylalanin() {
        return phenylalanin;
    }

    public void setPhenylalanin(Double phenylalanin) {
        this.phenylalanin = phenylalanin;
    }

    public Double getThreonin() {
        return threonin;
    }

    public void setThreonin(Double threonin) {
        this.threonin = threonin;
    }

    public Double getValine() {
        return valine;
    }

    public void setValine(Double valine) {
        this.valine = valine;
    }

    public Double getLeucine() {
        return leucine;
    }

    public void setLeucine(Double leucine) {
        this.leucine = leucine;
    }

    public Double getIsoleucine() {
        return isoleucine;
    }

    public void setIsoleucine(Double isoleucine) {
        this.isoleucine = isoleucine;
    }

    public Double getArginine() {
        return arginine;
    }

    public void setArginine(Double arginine) {
        this.arginine = arginine;
    }

    public Double getHistidine() {
        return histidine;
    }

    public void setHistidine(Double histidine) {
        this.histidine = histidine;
    }

    public Double getCystine() {
        return cystine;
    }

    public void setCystine(Double cystine) {
        this.cystine = cystine;
    }

    public Double getTyrosine() {
        return tyrosine;
    }

    public void setTyrosine(Double tyrosine) {
        this.tyrosine = tyrosine;
    }

    public Double getAlanine() {
        return alanine;
    }

    public void setAlanine(Double alanine) {
        this.alanine = alanine;
    }

    public Double getAsparticAcid() {
        return asparticAcid;
    }

    public void setAsparticAcid(Double asparticAcid) {
        this.asparticAcid = asparticAcid;
    }

    public Double getGlutamicAcid() {
        return glutamicAcid;
    }

    public void setGlutamicAcid(Double glutamicAcid) {
        this.glutamicAcid = glutamicAcid;
    }

    public Double getGlycine() {
        return glycine;
    }

    public void setGlycine(Double glycine) {
        this.glycine = glycine;
    }

    public Double getProline() {
        return proline;
    }

    public void setProline(Double proline) {
        this.proline = proline;
    }

    public Double getSerine() {
        return serine;
    }

    public void setSerine(Double serine) {
        this.serine = serine;
    }

    public LoaiProtein getLoaiProtein() {
        return loaiProtein;
    }

    public void setLoaiProtein(LoaiProtein loaiProtein) {
        this.loaiProtein = loaiProtein;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public TrangThai getTrangThai() {
        return trangThai;
    }

    public void setTrangThai(TrangThai trangThai) {
        this.trangThai = trangThai;
    }
}
