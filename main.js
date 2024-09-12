$(function () {
    // КАЛЬКУЛЯТОР БУКВ

    var heightLetter = 118;
    var PriceFontLetter = 0;
    var material = 0;
    var substratePrice = 0;
    var previewText = "";
    var ResultSubstrate = "Нет"

    function LettersValue() {
        $("#LettersText span").text(previewText);
        $("#LettersHeight span").text(`${heightLetter} см`);
        $("#LettersLight span").text($(".calc__view-item.active").data("name"));
        $("#LettersMaterial span").text($(".calc__select-result.active span").text());
        $("#LettersFont span").text($("input[name='type-font']:checked").val());
        $("#ResultSubstrate span").text(ResultSubstrate);
        $("#ResultSubstrateWidth span").text(`${$('#SubstrateWidth').val()} мм`);
        $("#ResultSubstrateHeight span").text(`${$('#SubstrateHeight').val()} мм`);
    }

    // ТЕКСТ

    if($("#LetterText").val() == '') {
        previewText = 'Введите текст'
    }

    $("#LetterText").on("input", function () {
        previewText = $("#LetterText").val();
        LettersValue();
    });

    // RANGE SLIDER
    $("#LetterRangeHeight").slider({
        min: 0,
        max: 120,
        value: 118,
        create: function () {
            // Обновляем tooltip и значение инпута при создании слайдера
            updateTooltip($(this).slider("value"));
            $("#LetterRangeHeightInput").val($(this).slider("value"));
        },
        slide: function (event, ui) {
            // Обновляем инпут и tooltip при перемещении ползунка
            $("#LetterRangeHeightInput").val(ui.value);
            updateTooltip(ui.value);

            // Обновляем значение heightLetter при перемещении ползунка
            heightLetter = parseFloat(ui.value);
            calcLetters();
            LettersValue();
        },
        stop: function (event, ui) {
            // Обновляем tooltip при остановке ползунка
            updateTooltip(ui.value);
        },
    });

    // Функция для обновления tooltip слайдера
    function updateTooltip(value) {
        var slider = $("#LetterRangeHeight");
        var tooltip = $("#LetterRangeHeightTooltip");
        var handle = slider.find(".ui-slider-handle");

        tooltip.text(value); // Обновляем текст в tooltip

        var handleOffset = handle.offset().left;
        var sliderOffset = slider.offset().left;

        var handlePosition = handleOffset - sliderOffset + handle.width() / 2;

        var minTooltipPosition = 0 + tooltip.width() / 2;
        var maxTooltipPosition = slider.width() - tooltip.width() / 2;

        if (handlePosition < minTooltipPosition) {
            handlePosition = minTooltipPosition;
        } else if (handlePosition > maxTooltipPosition) {
            handlePosition = maxTooltipPosition;
        }

        tooltip.css({
            left: handlePosition + "px",
        });
    }

    // Обновление слайдера при изменении значения в инпуте
    $("#LetterRangeHeightInput").on("input", function () {
        var value = parseFloat($(this).val());
        if (!isNaN(value) && value >= 0 && value <= 120) {
            // Убедитесь, что значение в диапазоне
            $("#LetterRangeHeight").slider("value", value); // Обновляем значение слайдера
            updateTooltip(value); // Обновляем tooltip

            // Обновляем значение heightLetter при вводе в инпут
            heightLetter = value;
            calcLetters();
            LettersValue();
        }
    });

    // SELECT

    $(".calc__select").each(function () {
        let select = $(this);

        let result = select.find(".calc__select-result");

        let resultText = select.find(".calc__select-result span");

        let options = select.find(".calc__select-options");

        let option = select.find(".calc__select-option");

        result.click(function () {
            options.slideToggle();
        });

        option.each(function () {
            let name = $(this).data("name");
            let price = $(this).data("price");

            $(this).click(function () {
                resultText.text(name);
                options.slideToggle();

                material = parseFloat(price);
                LettersValue();
                calcLetters();
            });
        });

        $(document).click(function (e) {
            if (!select.is(e.target) && select.has(e.target).length === 0) {
                options.slideUp();
            }
        });
    });

    // Вид БУКВ

    function ViewOptions(view) {
        if (view.data("name") == "Несветовые" && view.hasClass("active")) {
            $("#TypeLetters").show();
            $("#ForLightLetters").hide();
            if (
                $(".calc__type-letter input:checked").val() == "Объемные буквы"
            ) {
                $("#ForVolumetricLetters").show();
                $(".calc__select-result").removeClass("active");
                $("#ForVolumetricLetters .calc__select-result").addClass(
                    "active"
                );
                $("#ForFlatLetters").hide();
            } else if (
                $(".calc__type-letter input:checked").val() == "Плоские буквы"
            ) {
                $("#ForFlatLetters").show();
                $("#ForFlatLetters .calc__select-result").addClass("active");
                $(".calc__select-result").removeClass("active");
                $("#ForVolumetricLetters").hide();
            }
        } else if (view.data("name") == "Световые" && view.hasClass("active")) {
            $("#ForLightLetters").show();
            $(".calc__select-result").removeClass("active");
            $("#ForLightLetters .calc__select-result").addClass("active");
            $("#TypeLetters").hide();
            $("#ForVolumetricLetters").hide();
            $("#ForFlatLetters").hide();
        }

        material = 0;

        calcLetters();
        LettersValue();
    }

    $(".calc__view-item").click(function () {
        $(".calc__view-item").removeClass("active");

        $(this).addClass("active");

        ViewOptions($(this));

        $(".calc__select-result span").text("Выберите материал");
    });

    const activeView = $(".calc__view-item.active");
    if (activeView.length > 0) {
        ViewOptions(activeView);
    }

    // Тип БУКВ

    function TypeLetter(type) {
        if (type.val() == "Объемные буквы") {
            $("#ForVolumetricLetters").show();
            $("#ForFlatLetters").hide();
            $(".calc__select-result span").text("Выберите материал");
            material = 0;
        } else if (type.val() == "Плоские буквы") {
            $("#ForFlatLetters").show();
            $("#ForVolumetricLetters").hide();
            $(".calc__select-result span").text("Выберите материал");
            material = 0;
        } else if (type.val() == "Простой шрифт") {
            PriceFontLetter = parseFloat(type.data("price"));
        } else if (type.val() == "Сложный шрифт") {
            PriceFontLetter = parseFloat(type.data("price"));
        }

        calcLetters();
        LettersValue();
    }

    $(".calc__type-letter").each(function () {
        let radio = $(this).find("input");

        radio.change(function () {
            TypeLetter($(this));
        });
    });

    const activeType = $(".calc__type-letter input:checked");
    if (activeType.length > 0) {
        TypeLetter(activeType);
    }

    // ПОДЛОЖКА

    $("#YesSubstrate").click(function () {
        $(".calc__substrate-item").removeClass("active");
        $(this).addClass("active");
        $(".calc__substrate-size").show();
        $(".calc__substrate").hide();
        ResultSubstrate = 'Да'
        $('.result-block-substrate').css('display', 'flex')
        LettersValue()
    });

    $(".calc__substrate-back").click(function () {
        $(".calc__substrate-item").removeClass("active");
        $("#NoSubstrate").addClass("active");
        $(".calc__substrate-size").hide();
        $(".calc__substrate").show();
        $('.result-block-substrate').css('display', 'none')
        substratePrice = 0;
        ResultSubstrate = 'Нет'
        calcLetters();
        LettersValue()
    });

    function calcSubstrate() {
        let widthMM = parseFloat($("#SubstrateWidth").val());
        let heightMM = parseFloat($("#SubstrateHeight").val());

        if (
            isNaN(widthMM) ||
            isNaN(heightMM) ||
            widthMM <= 0 ||
            heightMM <= 0
        ) {
            return;
        }

        let widthMeters = widthMM / 1000;
        let heightMeters = heightMM / 1000;

        let areaSquareMeters = widthMeters * heightMeters;

        let pricePerSquareMeter = 5100;

        let substrateSumm = areaSquareMeters * pricePerSquareMeter;

        substratePrice = Math.round(substrateSumm);
    }

    $("#SubstrateWidth, #SubstrateHeight").on("input", function () {
        calcSubstrate();
        calcLetters();
        LettersValue()
    });

    function calcLetters() {
        let total = 0;
        // var heightLetter = 118
        // var PriceFontLetter = 0
        // var material = 0

        let fontLetter = material + PriceFontLetter;

        let sizeLetter = fontLetter * heightLetter;

        total = sizeLetter + substratePrice;

        $("#total span").text(`${total.toLocaleString('ru-RU')} ₽`);
    }

    calcLetters();
});
