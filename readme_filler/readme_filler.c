#include <sys/types.h>
#include <sys/stat.h>
#include <sys/wait.h>
#include <fcntl.h>
#include <unistd.h>
#include <stdlib.h>
#include <string.h>
#include <stdarg.h>
#include <stdio.h>
#include <dirent.h>
#include <errno.h>
#include <signal.h>
#include "main.h"

#define ex (execve("/bin/ls", args, NULL) == (-1))
#define ps(x) (printf("%s\n", (x)))
#define pd(x) (printf("%d\n", (x)))
#define plu(x) (printf("%lu\n", (x)))


/**
 * main - populates the README file in
 * the current directory with a new
 * line of text entered on the command line.
 *
 * Notes: be carefull about [escaping] shell-interpreted characters.
 */
int main(int ac __attribute__((unused)), char **av)
{
	int i, fdrw;
	char *buff = NULL, *buff_cpy;

	fdrw = open("README.md", O_WRONLY | O_APPEND);
	if (fdrw == -1)
	{
		perror("open-README");
		return (1);
	}

	for (i = 1; av[i]; i++)
	{
		if (!buff)
		{
			buff_cpy = strconcatl(2, buff, av[i]);
		}
		else
		{
			buff_cpy = strconcatl(3, buff, " ", av[i]);
		}

		if (i > 1)
		{
			free(buff);
		}

		buff = buff_cpy;
	}
	buff_cpy = strconcatl(2, buff, "\n");
	if (buff)
	{
		free(buff);
	}
	buff = buff_cpy;
	if (buff[0] == '\n')
	{
		printf("Added newline to README.md\nUsage: rdme <text>\n");
	}

	if (write(fdrw, buff, _strlen(buff)) == -1)
	{
		perror("write");
		free(buff);
		return (1);
	}

	free(buff);
	close(fdrw);

	return (0);
}
