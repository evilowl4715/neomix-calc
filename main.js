$(function () {

    $(".calc-tab").click(function() {
        $(".calc-tab").removeClass("active").eq($(this).index()).addClass("active");
        $(".calc-content").hide().eq($(this).index()).fadeIn()
    }).eq(0).addClass("active");




    // КАЛЬКУЛЯТОР БУКВ

    var heightLetter = 118;
    var PriceFontLetter = 0;
    var materialLetter = 0;
    var substratePrice = 0;
    var previewText = "";
    var ResultSubstrate = "Нет";

    function LettersValue() {
        $("#LettersText span").text(previewText);
        $("#LettersHeight span").text(`${heightLetter} см`);
        $("#LettersLight span").text(
            $("#CalcLetters .calc__view-item.active").data("name")
        );
        $("#LettersMaterial span").text(
            $("#CalcLetters .calc__select-result.active span").text()
        );
        $("#LettersFont span").text($("input[name='type-font']:checked").val());
        $("#ResultSubstrate span").text(ResultSubstrate);
        $("#ResultSubstrateWidth span").text(
            `${$("#SubstrateWidth").val()} мм`
        );
        $("#ResultSubstrateHeight span").text(
            `${$("#SubstrateHeight").val()} мм`
        );
    }

    // ТЕКСТ

    if ($("#LetterText").val() == "") {
        previewText = "Введите текст";
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
            updateTooltipLetter($(this).slider("value"));
            $("#LetterRangeHeightInput").val($(this).slider("value"));
        },
        slide: function (event, ui) {
            // Обновляем инпут и tooltip при перемещении ползунка
            $("#LetterRangeHeightInput").val(ui.value);
            updateTooltipLetter(ui.value);

            // Обновляем значение heightLetter при перемещении ползунка
            heightLetter = parseFloat(ui.value);
            calcLetters();
            LettersValue();
        },
        stop: function (event, ui) {
            // Обновляем tooltip при остановке ползунка
            updateTooltipLetter(ui.value);
        },
    });

    // Функция для обновления tooltip слайдера
    function updateTooltipLetter(value) {
        let slider = $("#LetterRangeHeight");
        let tooltip = $("#LetterRangeHeightTooltip");
        let handle = slider.find(".ui-slider-handle");

        tooltip.text(value); // Обновляем текст в tooltip

        let handleOffset = handle.offset().left;
        let sliderOffset = slider.offset().left;

        let handlePosition = handleOffset - sliderOffset + handle.width() / 2;

        let minTooltipPosition = 0 + tooltip.width() / 2;
        let maxTooltipPosition = slider.width() - tooltip.width() / 2;

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
        let value = parseFloat($(this).val());
        if (!isNaN(value) && value >= 0 && value <= 120) {
            // Убедитесь, что значение в диапазоне
            $("#LetterRangeHeight").slider("value", value); // Обновляем значение слайдера
            updateTooltipLetter(value); // Обновляем tooltip

            // Обновляем значение heightLetter при вводе в инпут
            heightLetter = value;
            calcLetters();
            LettersValue();
        }
    });

    // SELECT

    $("#CalcLetters .calc__select").each(function () {
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

                materialLetter = parseFloat(price);
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

    function ViewOptionsLetters(view) {
        if (view.data("name") == "Несветовые" && view.hasClass("active")) {
            $("#TypeLetters").show();
            $("#ForLightLetters").hide();
            if (
                $(".calc__type-letter input:checked").val() == "Объемные буквы"
            ) {
                $("#ForVolumetricLetters").show();
                $("#CalcLetters .calc__select-result").removeClass("active");
                $("#ForVolumetricLetters .calc__select-result").addClass(
                    "active"
                );
                $("#ForFlatLetters").hide();
            } else if (
                $("#CalcLetters .calc__type-letter input:checked").val() ==
                "Плоские буквы"
            ) {
                $("#ForFlatLetters").show();
                $("#ForFlatLetters .calc__select-result").addClass("active");
                $("#CalcLetters .calc__select-result").removeClass("active");
                $("#ForVolumetricLetters").hide();
            }
        } else if (view.data("name") == "Световые" && view.hasClass("active")) {
            $("#ForLightLetters").show();
            $("#CalcLetters .calc__select-result").removeClass("active");
            $("#ForLightLetters .calc__select-result").addClass("active");
            $("#TypeLetters").hide();
            $("#ForVolumetricLetters").hide();
            $("#ForFlatLetters").hide();
        }

        materialLetter = 0;

        calcLetters();
        LettersValue();
    }

    $("#CalcLetters .calc__view-item").click(function () {
        $("#CalcLetters .calc__view-item").removeClass("active");

        $(this).addClass("active");

        ViewOptionsLetters($(this));

        $("#CalcLetters .calc__select-result span").text("Выберите материал");
    });

    const activeViewLetters = $("#CalcLetters .calc__view-item.active");
    if (activeViewLetters.length > 0) {
        ViewOptionsLetters(activeViewLetters);
    }

    // Тип БУКВ

    function TypeLetter(type) {
        if (type.val() == "Объемные буквы") {
            $("#ForVolumetricLetters").show();
            $("#ForFlatLetters").hide();
            $("#CalcLetters .calc__select-result span").text(
                "Выберите материал"
            );
            materialLetter = 0;
        } else if (type.val() == "Плоские буквы") {
            $("#ForFlatLetters").show();
            $("#ForVolumetricLetters").hide();
            $("#CalcLetters .calc__select-result span").text(
                "Выберите материал"
            );
            materialLetter = 0;
        } else if (type.val() == "Простой шрифт") {
            PriceFontLetter = parseFloat(type.data("price"));
        } else if (type.val() == "Сложный шрифт") {
            PriceFontLetter = parseFloat(type.data("price"));
        }

        calcLetters();
        LettersValue();
    }

    $("#CalcLetters .calc__type-letter").each(function () {
        let radio = $(this).find("input");

        radio.change(function () {
            TypeLetter($(this));
        });
    });

    const activeType = $("#CalcLetters .calc__type-letter input:checked");
    if (activeType.length > 0) {
        TypeLetter(activeType);
    }

    // ПОДЛОЖКА

    $("#YesSubstrate").click(function () {
        $(".calc__substrate-item").removeClass("active");
        $(this).addClass("active");
        $(".calc__substrate-size").show();
        $(".calc__substrate").hide();
        ResultSubstrate = "Да";
        $(".result-block-substrate").css("display", "flex");
        LettersValue();
    });

    $(".calc__substrate-back").click(function () {
        $(".calc__substrate-item").removeClass("active");
        $("#NoSubstrate").addClass("active");
        $(".calc__substrate-size").hide();
        $(".calc__substrate").show();
        $(".result-block-substrate").css("display", "none");
        substratePrice = 0;
        ResultSubstrate = "Нет";
        calcLetters();
        LettersValue();
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
        LettersValue();
    });

    function calcLetters() {
        let total = 0;

        let fontLetter = materialLetter + PriceFontLetter;

        let sizeLetter = fontLetter * heightLetter;

        total = sizeLetter + substratePrice;

        $("#totalLetters span").text(`${total.toLocaleString("ru-RU")} ₽`);
    }

    if ($("#CalcLetters").length > 0) {
        calcLetters();
    }

    // КАЛЬКУЛЯТОР КОРОБКА

    function BoxValue() {
        $("#BoxView span").text($("#CalcBox .calc__view-item.active").text());
        $("#BoxForm span").text(
            $("#CalcBox .calc__type-letter input:checked").val()
        );
        $("#BoxMaterial span").text(
            $("#CalcBox .calc__select-result span").text()
        );
        $("#BoxWidth span").text(`${$("#BoxRangeWidthInput").val()} см`);
        $("#BoxHeight span").text(`${$("#BoxRangeHeightInput").val()} см`);
    }

    var materialBox = 0;
    var heightBox = 0;
    var widthBox = 0;
    var priceFormtBox = 0;

    // RANGE SLIDER
    function updateTooltipBox(slider, tooltip) {
        let handle = slider.find(".ui-slider-handle");

        let handleOffset = handle.offset().left;
        let sliderOffset = slider.offset().left;

        let handlePosition = handleOffset - sliderOffset + handle.width() / 2;

        let minTooltipPosition = 0 + tooltip.width() / 2;
        let maxTooltipPosition = slider.width() - tooltip.width() / 2;

        if (handlePosition < minTooltipPosition) {
            handlePosition = minTooltipPosition;
        } else if (handlePosition > maxTooltipPosition) {
            handlePosition = maxTooltipPosition;
        }

        tooltip.css({
            left: handlePosition + "px",
        });
    }

    // Пример использования для первого слайдера
    $("#BoxRangeWidth").slider({
        min: 0,
        max: 12000,
        value: 1000,
        create: function () {
            updateTooltipBox($("#BoxRangeWidth"), $("#BoxRangeWidthTooltip"));
            $("#BoxRangeWidthInput").val($(this).slider("value"));
        },
        slide: function (event, ui) {
            $("#BoxRangeWidthInput").val(ui.value);
            updateTooltipBox($("#BoxRangeWidth"), $("#BoxRangeWidthTooltip"));
            widthBox = parseFloat(ui.value);
            calcBox();
        },
        stop: function (event, ui) {
            updateTooltipBox($("#BoxRangeWidth"), $("#BoxRangeWidthTooltip"));
        },
    });

    // Обновление слайдера при изменении значения в инпуте
    $("#BoxRangeWidthInput").on("input", function () {
        let value = parseFloat($(this).val());
        if (!isNaN(value) && value >= 0 && value <= 12000) {
            // Убедитесь, что диапазон совпадает с диапазоном слайдера
            $("#BoxRangeWidth").slider("value", value); // Теперь обновляем слайдер ширины
            updateTooltipBox(
                $("#BoxRangeWidth"),
                $("#BoxRangeWidthTooltip"),
                value
            ); // Обновляем tooltip
            widthBox = value;
            calcBox();
        }
    });

    // Пример использования для второго слайдера
    $("#BoxRangeHeight").slider({
        min: 0,
        max: 12000,
        value: 1000,
        create: function () {
            updateTooltipBox($("#BoxRangeHeight"), $("#BoxRangeHeightTooltip"));
            $("#BoxRangeHeightInput").val($(this).slider("value"));
        },
        slide: function (event, ui) {
            $("#BoxRangeHeightInput").val(ui.value);
            updateTooltipBox($("#BoxRangeHeight"), $("#BoxRangeHeightTooltip"));
            heightBox = parseFloat(ui.value);
            calcBox();
        },
        stop: function (event, ui) {
            updateTooltipBox($("#BoxRangeHeight"), $("#BoxRangeHeightTooltip"));
        },
    });

    // Обновление слайдера при изменении значения в инпуте
    $("#BoxRangeHeightInput").on("input", function () {
        let value = parseFloat($(this).val());
        if (!isNaN(value) && value >= 0 && value <= 12000) {
            // Убедитесь, что диапазон совпадает с диапазоном слайдера
            $("#BoxRangeHeight").slider("value", value); // Обновляем слайдер высоты
            updateTooltipBox(
                $("#BoxRangeHeight"),
                $("#BoxRangeHeightTooltip"),
                value
            ); // Обновляем tooltip
            heightBox = value;
            calcBox();
        }
    });

    // Вид Коробки
    function ViewOptionsBox(view) {
        if (view.data("name") == "Несветовые" && view.hasClass("active")) {
            $("#ForNotLightBox").show();
            $("#FortLightBox").hide();
        } else if (view.data("name") == "Световые" && view.hasClass("active")) {
            $("#FortLightBox").show();
            $("#ForNotLightBox").hide();
        }

        materialBox = 0; // Сбрасываем значение материала на 0

        calcBox();
        // LettersValue();
    }

    $("#CalcBox .calc__view-item").click(function () {
        $("#CalcBox .calc__view-item").removeClass("active");

        $(this).addClass("active");

        ViewOptionsBox($(this));

        $("#CalcBox .calc__select-result span").text("Выберите материал");
    });

    const activeView = $("#CalcBox .calc__view-item.active");
    if (activeView.length > 0) {
        ViewOptionsBox(activeView);
    }

    // SELECT
    $("#CalcBox .calc__select").each(function () {
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

                materialBox = parseFloat(price); // Присваиваем значение материала
                // LettersValue();
                calcBox();
            });
        });

        $(document).click(function (e) {
            if (!select.is(e.target) && select.has(e.target).length === 0) {
                options.slideUp();
            }
        });
    });

    // ТИП КОРОБКИ

    function TypeBox(type) {
        if (type.val() == "Простой формы") {
            priceFormtBox = parseFloat(type.data("price"));
        } else if (type.val() == "Сложной формы") {
            priceFormtBox = parseFloat(type.data("price"));
        }

        calcBox();
    }

    $("#CalcBox .calc__type-letter").each(function () {
        let radio = $(this).find("input");

        radio.change(function () {
            TypeBox($(this));
        });
    });

    // Функция для расчета
    function calcBox() {
        console.log(priceFormtBox + materialBox);

        let widthMM = parseFloat($("#BoxRangeWidthInput").val());
        let heightMM = parseFloat($("#BoxRangeHeightInput").val());

        if (
            isNaN(widthMM) ||
            isNaN(heightMM) ||
            widthMM <= 0 ||
            heightMM <= 0
        ) {
            return;
        }

        // Переводим миллиметры в метры
        let widthMeters = widthMM / 1000;
        let heightMeters = heightMM / 1000;

        let areaSquareMeters = widthMeters * heightMeters;

        // Подсчет итоговой суммы
        let subSumm = areaSquareMeters * materialBox + priceFormtBox;

        let total = Math.round(subSumm);

        // Отображаем результат
        $("#totalBox span").text(`${total.toLocaleString("ru-RU")} ₽`);

        BoxValue();
    }

    if ($("#CalcBox").length > 0) {
        calcBox();
    }

    // СВЕТОВЫЕ ПАНЕЛИ

    function PanelValue() {
        $("#PanelView span").text(
            $("#CalcPanel .calc__view-item.active").text()
        );
        $("#PanelFormat span").text(
            $("#CalcPanel .calc__type-letter input:checked").val()
        );
        $("#PanelMaterial span").text(
            $("#CalcPanel .calc__select-result span").text()
        );
    }

    $("#CalcPanel .calc__view-item").click(function () {
        $("#CalcPanel .calc__view-item").removeClass("active");

        $(this).addClass("active");
        calcPanel();
    });

    $("#CalcPanel .calc__type-letter").each(function () {
        let radio = $(this).find("input");

        radio.change(function () {
            calcPanel();
        });
    });

    // SELECT
    $("#CalcPanel .calc__select").each(function () {
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
            $(this).click(function () {
                resultText.text(name);
                options.slideToggle();
                calcPanel();
            });
        });

        $(document).click(function (e) {
            if (!select.is(e.target) && select.has(e.target).length === 0) {
                options.slideUp();
            }
        });
    });

    var totalPanel = 0;

    function calcPanel() {
        // Объект с ценами для разных комбинаций
        const priceList = {
            "Фремлайт-Односторонние-А4": 5900,
            "Фремлайт-Односторонние-А3": 7900,
            "Фремлайт-Односторонние-А2": 9864,
            "Фремлайт-Односторонние-А1": 14400,
            "Фремлайт-Односторонние-А0": 24000,
            "Фремлайт-Двусторонние-А4": 6200,
            "Фремлайт-Двусторонние-А3": 9100,
            "Фремлайт-Двусторонние-А2": 13700,
            "Фремлайт-Двусторонние-А1": 21500,
            "Фремлайт-Двусторонние-А0": 34500,
            "Акрилайт-Односторонние-А4": 9500,
            "Акрилайт-Односторонние-А3": 10500,
            "Акрилайт-Односторонние-А2": 11500,
            "Акрилайт-Односторонние-А1": 16000,
            "Акрилайт-Односторонние-А0": 24000,
            "Акрилайт-Двусторонние-А4": 9500,
            "Акрилайт-Двусторонние-А3": 10500,
            "Акрилайт-Двусторонние-А2": 11500,
            "Акрилайт-Двусторонние-А1": 16000,
            "Акрилайт-Двусторонние-А0": 24000,
            "Кристалайт-Односторонние-А4": 7200,
            "Кристалайт-Односторонние-А3": 9000,
            "Кристалайт-Односторонние-А2": 11700,
            "Кристалайт-Односторонние-А1": 16200,
            "Кристалайт-Односторонние-А0": 26100,
            "Кристалайт-Двусторонние-А4": 8100,
            "Кристалайт-Двусторонние-А3": 11100,
            "Кристалайт-Двусторонние-А2": 14220,
            "Кристалайт-Двусторонние-А1": 22500,
            "Кристалайт-Двусторонние-А0": 34800,
        };

        // Собираем ключ для поиска цены
        let resultText = $("#CalcPanel .calc__select-result span")
            .text()
            .trim();
        let viewItem = $("#CalcPanel .calc__view-item.active")
            .data("name")
            .trim();
        let panelFormat = $("#CalcPanel .calc__type-letter input:checked")
            .val()
            .trim();

        let key = `${resultText}-${viewItem}-${panelFormat}`;

        // Ищем цену по ключу
        totalPanel = priceList[key] || 0; // Если ключ не найден, установим 0

        console.log("Итого:", totalPanel);

        // Обновляем на странице
        $("#totalPanel span").text(totalPanel);

        PanelValue();
    }

    if ($("#CalcPanel").length > 0) {
        calcPanel();
    }

    // Панель-кронштейн

    function BracketValue() {
        $("#BracketType span").text(
            $("#CalcBracket .calc__select-result span").text()
        );
        $("#BracketParametrs span").text(
            $("#CalcBracket .parameters .calc__view-item.active").text()
        );
        $("#BracketLight span").text(
            $("#CalcBracket .views .calc__view-item.active").text()
        );
        $("#BracketSize span").text(
            `${$("#BracketRangeHeightTooltip").text()} см`
        );
    }

    // RANGE SLIDER
    $("#BracketRangeHeight").slider({
        min: 20,
        max: 100,
        value: 50,
        create: function () {
            // Обновляем tooltip и значение инпута при создании слайдера
            updateTooltipBracket($(this).slider("value"));
            $("#BracketRangeHeightInput").val($(this).slider("value"));
        },
        slide: function (event, ui) {
            // Обновляем инпут и tooltip при перемещении ползунка
            $("#BracketRangeHeightInput").val(ui.value);
            updateTooltipBracket(ui.value);

            // Обновляем значение heightLetter при перемещении ползунка
            heightBracket = parseFloat(ui.value);
            calcBracket();
        },
        stop: function (event, ui) {
            // Обновляем tooltip при остановке ползунка
            updateTooltipBracket(ui.value);
        },
    });

    // Функция для обновления tooltip слайдера
    function updateTooltipBracket(value) {
        var slider = $("#BracketRangeHeight");
        var tooltip = $("#BracketRangeHeightTooltip");
        var handle = slider.find(".ui-slider-handle");

        if (!handle.length) {
            console.error("Handle element not found");
            return;
        }

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
    $("#BracketRangeHeightInput").on("input", function () {
        let value = parseFloat($(this).val());
        if (!isNaN(value) && value >= 0 && value <= 120) {
            // Убедитесь, что значение в диапазоне
            $("#BracketRangeHeight").slider("value", value); // Обновляем значение слайдера
            updateTooltipBracket(value); // Обновляем tooltip

            // Обновляем значение heightLetter при вводе в инпут
            heightBracket = value;
            calcBracket();
        }
    });

    $("#CalcBracket .parameters .calc__view-item").click(function () {
        $("#CalcBracket .parameters .calc__view-item").removeClass("active");

        $(this).addClass("active");
        calcBracket();
    });

    $("#CalcBracket .views .calc__view-item").click(function () {
        $("#CalcBracket .views .calc__view-item").removeClass("active");

        $(this).addClass("active");
        calcBracket();
    });

    $("#CalcBracket .calc__select").each(function () {
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
            $(this).click(function () {
                resultText.text(name);
                options.slideToggle();
                calcBracket();
            });
        });

        $(document).click(function (e) {
            if (!select.is(e.target) && select.has(e.target).length === 0) {
                options.slideUp();
            }
        });
    });

    var totalPanelBracket = 0;

    const priceListBracket = {
        "Несветовые-Односторонние-Объемный": { "20-50": 8500, "50-100": 12500 },
        "Несветовые-Двусторонние-Объемный": { "20-50": 9000, "50-100": 14000 },
        "Световые-Односторонние-Объемный": { "20-50": 12000, "50-100": 15500 },
        "Световые-Двусторонние-Объемный": { "20-50": 12500, "50-100": 17000 },
        "Несветовые-Односторонние-Плоский": { "20-50": 5500, "50-100": 10000 },
        "Несветовые-Двусторонние-Плоский": { "20-50": 6000, "50-100": 11000 },
        "Несветовые-Односторонние-Аптечный крест": {
            "20-50": 8500,
            "50-100": 12500,
        },
        "Несветовые-Двусторонние-Аптечный крест": {
            "20-50": 9000,
            "50-100": 14500,
        },
        "Световые-Односторонние-Аптечный крест": {
            "20-50": 12000,
            "50-100": 15500,
        },
        "Световые-Двусторонние-Аптечный крест": {
            "20-50": 13000,
            "50-100": 17500,
        },
        "Односторонние-Аптечный крест пиксельный": {
            "20-50": 10000,
            "50-100": 12000,
        },
        "Двусторонние-Аптечный крест пиксельный": {
            "20-50": 12000,
            "50-100": 14000,
        },
        "Односторонние-Аптечный крест динамический": {
            "20-50": 18000,
            "50-100": 20000,
        },
        "Двусторонние-Аптечный крест динамический": {
            "20-50": 19000,
            "50-100": 20500,
        },
        "Несветовые-Односторонние-Фигурный": { "20-50": 8500, "50-100": 12500 },
        "Несветовые-Двусторонние-Фигурный": { "20-50": 9000, "50-100": 10500 },
        "Световые-Односторонние-Фигурный": { "20-50": 12000, "50-100": 17500 },
        "Световые-Двусторонние-Фигурный": { "20-50": 12500, "50-100": 19500 },
    };

    // Функция для получения ключа диапазона по размеру
    function getSizeRange(size) {
        if (size >= 20 && size <= 50) {
            return "20-50";
        } else if (size > 50 && size <= 100) {
            return "50-100";
        }
        return null;
    }

    // Функция расчета цены
    function calcBracket() {
        let material = $("#ForBracket .calc__select-result span").text().trim(); // Получаем выбранный материал
        let side = $("#CalcBracket .parameters .calc__view-item.active")
            .data("name")
            .trim(); // Получаем односторонние/двусторонние
        let size = parseFloat($("#BracketRangeHeightInput").val()); // Получаем введенный размер

        // Проверка, чтобы скрыть блок подсветки, если выбран динамический или пиксельный крест
        if (
            material === "Аптечный крест динамический" ||
            material === "Аптечный крест пиксельный"
        ) {
            $(".calc__option.views").hide(); // Скрыть блок подсветки
            // Для динамического и пиксельного креста убираем использование типа подсветки
            var key = `${side}-${material}`;
        } else {
            $(".calc__option.views").show(); // Показать блок подсветки для всех остальных опций
            let lighting = $("#CalcBracket .views .calc__view-item.active")
                .data("name")
                .trim(); // Получаем тип подсветки
            var key = `${lighting}-${side}-${material}`; // Собираем ключ с подсветкой для остальных опций
        }

        // Получаем диапазон по размеру
        let sizeRange = getSizeRange(size);

        if (
            priceListBracket[key] &&
            sizeRange &&
            priceListBracket[key][sizeRange]
        ) {
            totalPanelBracket = priceListBracket[key][sizeRange]; // Если ключ и диапазон найдены, берем цену
        } else {
            totalPanelBracket = 0; // Если ключ или диапазон не найдены, устанавливаем 0
        }

        console.log("Итого:", totalPanelBracket);

        // Обновляем на странице
        $("#totalBracket span").text(
            `${totalPanelBracket.toLocaleString("ru-RU")} ₽`
        );

        BracketValue();
    }

    // Пример вызова расчета при изменении параметров
    $(
        "#ForBracket .calc__select-option, #CalcBracket .parameters .calc__view-item, #CalcBracket .views .calc__view-item, #BracketRangeHeightInput"
    ).on("change input click", function () {
        calcBracket();
    });

    if ($("#ForBracket").length > 0) {
        calcBracket();
    }
});
