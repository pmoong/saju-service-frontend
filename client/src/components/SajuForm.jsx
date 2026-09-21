import { useState } from "react";

function SajuForm() {
  const [form, setForm] = useState({
    name: "",
    gender: "",
    birthDate: "",
    calendarType: "solar",
    isLeapMonth: false,
    birthHour: "",
    birthMinute: "",
    birthTimeUnknown: false,
    country: "대한민국",
    birthPlace: "",
    hanjaName: "",
  });

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;

    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("입력 데이터:", form);

    setLoading(true);
    setResult(null);

    try {
      // REACT_APP_SERVER_ADDRESS 환경변수 사용
      const serverAddress = import.meta.env.VITE_SERVER_ADDRESS;

      if (!serverAddress) {
        throw new Error(
          "REACT_APP_SERVER_ADDRESS 환경변수가 설정되지 않았습니다."
        );
      }

      // 환경변수 끝에 /가 있어도 중복되지 않도록 처리
      const apiUrl = `${serverAddress.replace(/\/$/, "")}/api/saju`;

      console.log("API 요청 주소:", apiUrl);

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();

      console.log("서버 응답:", data);

      if (!response.ok || !data.success) {
        throw new Error(data.message || "사주 분석에 실패했습니다.");
      }

      setResult(data.data);
    } catch (error) {
      console.error("사주 분석 오류:", error);
      alert(error.message || "서버와 연결할 수 없습니다.");
    } finally {
      setLoading(false);
    }
  };

  const getPillarString = (pillar) => {
    if (!pillar) return "-";

    return `${pillar.heavenlyStem || ""}${pillar.earthlyBranch || ""}`;
  };

  return (
    <div className="saju-container">
      <div className="saju-header">
        <h1>오늘의 사주</h1>
        <p>나의 사주와 오늘의 운세를 확인해보세요.</p>
      </div>

      <form className="saju-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input
            id="name"
            name="name"
            type="text"
            placeholder="이름을 입력해주세요"
            value={form.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>성별</label>

          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="male"
                checked={form.gender === "male"}
                onChange={handleChange}
                required
              />
              남성
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="gender"
                value="female"
                checked={form.gender === "female"}
                onChange={handleChange}
              />
              여성
            </label>
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="birthDate">생년월일</label>

          <input
            id="birthDate"
            name="birthDate"
            type="date"
            value={form.birthDate}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label>달력 종류</label>

          <div className="radio-group">
            <label className="radio-label">
              <input
                type="radio"
                name="calendarType"
                value="solar"
                checked={form.calendarType === "solar"}
                onChange={handleChange}
              />
              양력
            </label>

            <label className="radio-label">
              <input
                type="radio"
                name="calendarType"
                value="lunar"
                checked={form.calendarType === "lunar"}
                onChange={handleChange}
              />
              음력
            </label>
          </div>

          {form.calendarType === "lunar" && (
            <label className="checkbox-label">
              <input
                type="checkbox"
                name="isLeapMonth"
                checked={form.isLeapMonth}
                onChange={handleChange}
              />
              윤달입니다
            </label>
          )}
        </div>

        <div className="form-group">
          <label>출생시간</label>

          <div className="time-input-group">
            <input
              type="number"
              name="birthHour"
              min="0"
              max="23"
              placeholder="시"
              value={form.birthHour}
              onChange={handleChange}
              disabled={form.birthTimeUnknown}
            />

            <span>시</span>

            <input
              type="number"
              name="birthMinute"
              min="0"
              max="59"
              placeholder="분"
              value={form.birthMinute}
              onChange={handleChange}
              disabled={form.birthTimeUnknown}
            />

            <span>분</span>
          </div>

          <label className="checkbox-label">
            <input
              type="checkbox"
              name="birthTimeUnknown"
              checked={form.birthTimeUnknown}
              onChange={handleChange}
            />
            출생시간을 모릅니다
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="country">출생 국가</label>

          <select
            id="country"
            name="country"
            value={form.country}
            onChange={handleChange}
          >
            <option value="대한민국">대한민국</option>
            <option value="미국">미국</option>
            <option value="일본">일본</option>
            <option value="중국">중국</option>
            <option value="캐나다">캐나다</option>
            <option value="호주">호주</option>
            <option value="기타">기타</option>
          </select>
        </div>

        <div className="form-group">
          <label htmlFor="birthPlace">출생 도시</label>

          <input
            id="birthPlace"
            name="birthPlace"
            type="text"
            placeholder="예: 서울특별시"
            value={form.birthPlace}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="hanjaName">
            한자 이름 <span className="optional">(선택)</span>
          </label>

          <input
            id="hanjaName"
            name="hanjaName"
            type="text"
            placeholder="예: 洪吉童"
            value={form.hanjaName}
            onChange={handleChange}
          />
        </div>

        <button type="submit" className="submit-button" disabled={loading}>
          {loading ? "사주 분석 중..." : "사주 분석 시작하기"}
        </button>

        <p className="privacy-notice">
          입력하신 정보는 분석을 위해 사용되며 서비스에서 별도로 저장하지
          않습니다.
        </p>
      </form>

      {result && (
        <div className="saju-result">
          <div className="result-header">
            <span className="result-label">SAJU ANALYSIS</span>

            <h2>{form.name}님의 사주 분석</h2>

            <p>
              {form.birthDate}
              {" · "}
              {form.calendarType === "solar" ? "양력" : "음력"}
              {" · "}
              {form.birthPlace}
            </p>
          </div>

          <section className="result-card">
            <div className="section-title">
              <span>01</span>
              <div>
                <h3>사주 원국</h3>
                <p>태어난 순간의 네 기둥입니다.</p>
              </div>
            </div>

            <div className="pillars">
              {[
                ["년주", result.saju?.pillars?.year],
                ["월주", result.saju?.pillars?.month],
                ["일주", result.saju?.pillars?.day],
                ["시주", result.saju?.pillars?.hour],
              ].map(([title, pillar]) => (
                <div
                  className={`pillar ${
                    title === "일주" ? "pillar-main" : ""
                  }`}
                  key={title}
                >
                  <span className="pillar-title">{title}</span>

                  <strong>{getPillarString(pillar)}</strong>

                  {title === "일주" && <small>나를 나타내는 기둥</small>}
                </div>
              ))}
            </div>
          </section>

          <section className="result-card">
            <div className="section-title">
              <span>02</span>
              <div>
                <h3>오행</h3>
                <p>사주에 나타난 오행의 구성입니다.</p>
              </div>
            </div>

            <div className="info-grid">
              {[
                ["년주", result.saju?.elements?.year],
                ["월주", result.saju?.elements?.month],
                ["일주", result.saju?.elements?.day],
                ["시주", result.saju?.elements?.hour],
              ].map(([title, element]) => (
                <div className="info-item" key={title}>
                  <span>{title}</span>

                  <strong>
                    {element?.stem || "-"}
                    {" · "}
                    {element?.branch || "-"}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <section className="result-card">
            <div className="section-title">
              <span>03</span>
              <div>
                <h3>십신</h3>
                <p>각 기둥의 십신 관계입니다.</p>
              </div>
            </div>

            <div className="info-grid">
              {[
                ["년주", result.saju?.tenGods?.year],
                ["월주", result.saju?.tenGods?.month],
                ["일주", result.saju?.tenGods?.day],
                ["시주", result.saju?.tenGods?.hour],
              ].map(([title, gods]) => (
                <div className="info-item" key={title}>
                  <span>{title}</span>

                  <strong>
                    {gods?.stem || "-"}
                    {" · "}
                    {gods?.branch || "-"}
                  </strong>
                </div>
              ))}
            </div>
          </section>

          <section className="result-card">
            <div className="section-title">
              <span>04</span>
              <div>
                <h3>대운</h3>
                <p>
                  {result.saju?.luckPillars?.startAge}세부터 시작되는 10년
                  단위의 흐름입니다.
                </p>
              </div>
            </div>

            <div className="luck-pillars">
              {result.saju?.luckPillars?.pillars?.map((item, index) => (
                <div
                  className={`luck-pillar ${
                    index === 0 ? "luck-pillar-first" : ""
                  }`}
                  key={`${item.age}-${index}`}
                >
                  <span>{item.age}세</span>
                  <strong>{item.korean}</strong>
                </div>
              ))}
            </div>
          </section>

          <section className="result-card interpretation-card">
            <div className="section-title">
              <span>05</span>
              <div>
                <h3>사주 해석</h3>
                <p>만세력 데이터를 바탕으로 한 AI 해석입니다.</p>
              </div>
            </div>

            <div className="interpretation-list">
              <div className="interpretation-section">
                <h4>전체적인 사주</h4>
                <p>{result.interpretation?.saju?.summary}</p>
              </div>

              <div className="interpretation-section">
                <h4>성격과 기질</h4>
                <p>{result.interpretation?.saju?.personality}</p>
              </div>

              <div className="interpretation-section">
                <h4>직업과 적성</h4>
                <p>{result.interpretation?.saju?.career}</p>
              </div>

              <div className="interpretation-section">
                <h4>재물운</h4>
                <p>{result.interpretation?.saju?.wealth}</p>
              </div>

              <div className="interpretation-section">
                <h4>연애와 인간관계</h4>
                <p>{result.interpretation?.saju?.love}</p>
              </div>

              <div className="interpretation-section">
                <h4>건강과 생활</h4>
                <p>{result.interpretation?.saju?.health}</p>
              </div>

              <div className="interpretation-section">
                <h4>전체적인 조언</h4>
                <p>{result.interpretation?.saju?.advice}</p>
              </div>
            </div>
          </section>

          <section className="today-card">
            <div className="today-header">
              <span className="today-label">TODAY'S FORTUNE</span>

              <h2>오늘의 운세</h2>

              <p>
                {result.today?.date}
                {" · "}
                오늘의 일주 {result.today?.dayString}
              </p>
            </div>

            <div className="today-list">
              <div className="today-item today-main">
                <span>오늘의 전체운</span>
                <p>{result.interpretation?.today?.overall}</p>
              </div>

              <div className="today-item">
                <span>직장 · 업무운</span>
                <p>{result.interpretation?.today?.career}</p>
              </div>

              <div className="today-item">
                <span>재물운</span>
                <p>{result.interpretation?.today?.wealth}</p>
              </div>

              <div className="today-item">
                <span>연애운</span>
                <p>{result.interpretation?.today?.love}</p>
              </div>

              <div className="today-item">
                <span>대인관계</span>
                <p>{result.interpretation?.today?.relationship}</p>
              </div>

              <div className="today-item">
                <span>오늘의 주의사항</span>
                <p>{result.interpretation?.today?.caution}</p>
              </div>

              <div className="today-item">
                <span>오늘의 조언</span>
                <p>{result.interpretation?.today?.advice}</p>
              </div>
            </div>
          </section>

          <p className="result-disclaimer">
            사주와 운세 해석은 전통 명리학을 바탕으로 한 참고용 콘텐츠이며, 실제
            미래를 확정적으로 예측하거나 전문적인 판단을 대신하지 않습니다.
          </p>
        </div>
      )}
    </div>
  );
}

export default SajuForm;