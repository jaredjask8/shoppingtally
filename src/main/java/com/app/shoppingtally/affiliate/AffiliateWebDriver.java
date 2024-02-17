package com.app.shoppingtally.affiliate;

import java.time.Duration;
import java.util.ArrayList;


import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.openqa.selenium.chrome.ChromeOptions;
import org.openqa.selenium.support.ui.ExpectedConditions;
import org.openqa.selenium.support.ui.WebDriverWait;
import org.springframework.ai.chat.ChatClient;
import org.springframework.ai.openai.OpenAiChatClient;
import org.springframework.ai.openai.OpenAiChatOptions;
import org.springframework.ai.openai.api.OpenAiApi;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import java.util.List;

import com.app.shoppingtally.auth.ListUtils;
import com.app.shoppingtally.auth.models.ListItemResponse;
import com.app.shoppingtally.config.JwtService;
import com.app.shoppingtally.list.ListRepository;
import com.app.shoppingtally.list.UserList;
import com.app.shoppingtally.user.UserRepo;

import lombok.AllArgsConstructor;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;

@Service
@Slf4j
@RequiredArgsConstructor
public class AffiliateWebDriver {
	private final ListRepository listRepo;
	private final UserRepo userRepo;
	private final JwtService jwtService;
	private final ListUtils listUtils;
	private final AffiliateRepository affiliateRepo;
	private final ChatClient chatClient;
	
	public List<AffiliateData> startDriver(String token){
		String itemsToString="";
		String[] itemsFromAI = new String[5];
		ArrayList<AffiliateData> affiliateArray = new ArrayList<AffiliateData>();
		
		Long userId = userRepo.findByEmail(jwtService.extractUsername(token)).get().getId();
		String currentList = listRepo.findByCurrentOrder(userId).get(0).getList();
		int j = 0;
		for(ListItemResponse item : listUtils.convertStringListToArray(currentList)) {
			if(++j == listUtils.convertStringListToArray(currentList).size()) {
				itemsToString += item.getName();
			}else {
				itemsToString += item.getName()+", ";
			}
			
		}
		String promptString = "Give me 5 recommendations of kitchen tools related to these items: "
							+itemsToString+". There should only be 5 tools separated by commas in the output. These tools should not be in a numbered list!";
		//call ai and get results
		//results 
		String aiResponse = chatClient.call(promptString);
		itemsFromAI = aiResponse.split(",");
		
		try {
			System.setProperty("webdriver.chrome.driver", "C:\\Users\\jared\\dev\\chromedriver\\chromedriver.exe");
			ChromeOptions options = new ChromeOptions();
			options.addArguments("--remote-allow-origins=*");
			options.addArguments("--headless=new");
			options.addArguments("--user-agent=Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/79.0.3945.130 Safari/537.36");
			WebDriver driver = new ChromeDriver(options);
			WebDriverWait wait = new WebDriverWait(driver, Duration.ofMillis(10000));
			driver.get("https://amazon.com");
			//id="nav-link-accountList"
			driver.manage().timeouts().implicitlyWait(Duration.ofMillis(10000));
			driver.findElement(By.id("nav-link-accountList")).click();
			driver.manage().timeouts().implicitlyWait(Duration.ofMillis(5000));
			driver.findElement(By.id("ap_email")).sendKeys("jaredjaskolski23@gmail.com");
			driver.findElement(By.id("continue")).click();
			driver.findElement(By.id("ap_password")).sendKeys("BigTimbers85!");
			driver.findElement(By.id("signInSubmit")).click();
			//create function for below
			for(int i = 0; i < itemsFromAI.length; i++) {
				//call the function
				driver.findElement(By.id("twotabsearchtextbox")).clear();
				driver.findElement(By.id("twotabsearchtextbox")).sendKeys(itemsFromAI[i]);
				driver.findElement(By.id("nav-search-submit-button")).click();
				String image = driver.findElement(By.className("s-image")).getAttribute("src");
				String name = driver.findElement(By.id("search")).findElement(By.tagName("h2")).getText();
				//go to item page
				driver.findElement(By.className("s-product-image-container")).findElement(By.tagName("a")).click();
				driver.findElement(By.id("amzn-ss-text-link")).findElement(By.tagName("a")).click();
				String link = wait.until(ExpectedConditions.visibilityOfElementLocated(By.id("amzn-ss-text-shortlink-textarea"))).getText();
				affiliateArray.add(AffiliateData.builder().image(image).link(link).name(name).build());
			}
			
			driver.close();
			return affiliateArray;
		}catch(Exception e) {
			return new ArrayList<AffiliateData>();
		}

		//*[@id="amzn-ss-text-shortlink-textarea"]
	}

	

	
}
