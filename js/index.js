$("#calcular").click((event) => {
    event.preventDefault();

    let tipoInvest = $("#tipoInvest").find(":selected").text();
    let juros = $("#juros").val();
    let tipoJuros = $("#tipoJuros").find(":selected").text();
    let capital = $("#capital").val();
    let periodo = $("#periodo").val();

    // Juros
    let jurosMensais;
    switch(tipoJuros) {
        case "a.a.":
            jurosMensais = (juros / 100) / 12;
            break;
        case "do CDI":
            jurosMensais = ((juros /100) * 0.0296) / 12;
    }

    // Montante 
    let montante = capital * Math.pow((1 + jurosMensais), periodo); 
    montante = roundToTwo(montante);

    // Calculando Lucro e IR
    let ir;

    switch(tipoInvest) {
        case "LCI":
        case "LCA":
            ir = 0;
            break;
        case "CDB":
        case "LC":
            if (periodo <= 6) 
                ir = 0.225;
            else if (periodo <= 12)
                ir = 0.2;
            else if (periodo <= 24)
                ir = 0.175;
            else 
                ir = 0.15
    }

    let lucroBruto = (montante - capital);
    let totalIR = lucroBruto * ir;
    totalIR = roundToTwo(totalIR);
    let lucroLiq = lucroBruto - totalIR;
    lucroLiq = roundToTwo(lucroLiq);

    let rowId = parseInt($("tbody th:last").text()) + 1;

    let registro = `
        <tr style="display: none;">
            <th scope="row">${rowId}</th>
            <td>${tipoInvest}</td>
            <td>${juros}% ${tipoJuros}</td>
            <td>R$${capital}</td>
            <td>${periodo} meses</td>
            <td>R$${montante}</td>
            <td>${ir*100}%</td>
            <td>R$${lucroLiq}</td>
        </tr>
    `;

    $(".registros").append(registro);
    $(".registros tr:last").show("slow");

    limparForm();

});

function limparForm() {
    $("#tipoInvest").val("CDB");
    $("#juros").val("");
    $("#tipoJuros").val("do CDI");
    $("#capital").val("");
    $("#periodo").val("");
}

function roundToTwo(num) {    
    return +(Math.round(num + "e+2")  + "e-2");
}